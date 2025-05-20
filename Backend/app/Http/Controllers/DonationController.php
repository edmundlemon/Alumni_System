<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Support\Str;
use App\Models\DonationPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Razorpay\Api\Api; // Add this import

class DonationController extends Controller
{
    protected $razor;

    public function __construct()
    {
        $this->razor = new Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret')
        );
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Donation::latest() already returns a Builder → call ->get()
        $donations = Donation::latest()->get();

        return response()->json([
            'donations' => $donations,
        ]);
    }

    /* POST /api/donations/create-order
       Body: { "amount": 12.34 }   // amount in SGD */
    public function createOrder(Request $request, DonationPost $donationPost)
        // ①  Validate request
        // 0.50 SGD = 50 cents
        // Razorpay minimum amount is 0.50 SGD
        // Razorpay minimum amount is 1 cent
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.5',    // >= 0.50 SGD
        ]);

        // ②  Convert dollars → cents
        $amountCents = (int) round($request->amount * 100);
        // ③  Create Razorpay order (server‑side!)
        $rzpOrder = $this->razor->order->create([
            'amount'          => $amountCents,
            'currency'        => 'SGD',
            // 'receipt'         => 'rcpt_'.Str::uuid(),
            'receipt' => 'rcpt_' . substr((string) Str::uuid(), 0, 35),

            'payment_capture' => 1,  // auto‑capture
            // you can add arbitrary notes
        ]);

        return response()->json([
            'order_id' => $rzpOrder['id'],
            'key'     => config('services.razorpay.key'),
        ]);
        
 
    }

    public function verifyPayment(Request $request, DonationPost $donationPost)

    {
        Log::channel('auth_activity')->info('verifyPayment', $request->all());
        $request->validate([
            'amount' => 'required|numeric|min:0.5',    // >= 0.50 SGD
        ]);
        Donation::create([
            'donation_post_id' => $donationPost->id, // or null / guest
            'user_id'           => Auth::guard('sanctum')->user()->id,               // or null / guest
            'donated_amount'      => $request->amount,
            'currency'          => 'SGD',
            'razorpay_order_id' => $request->razorpay_order_id,
            'payment_status'            => 'paid',                  // enum: pending|paid|failed
        ]);

        return response()->json(['status' => 'ok']);
    }

    /* OPTIONAL: POST /api/razorpay/webhook     (webhook endpoint)
       Handle payment.captured, payment.failed, refund.created … */
    public function webhook(Request $request)
    {
        $payload   = $request->getContent();
        $signature = $request->header('X-Razorpay-Signature');

        $secret    = config('services.razorpay.webhook_secret'); // set in .env

        $expected  = hash_hmac('sha256', $payload, $secret);

        if ($expected !== $signature) {
            return response('Invalid signature', 400);
        }

        $event = $request->input('event');

        if ($event === 'payment.captured') {
            $orderId = $request->input('payload.payment.entity.order_id');

            Donation::where('razorpay_order_id', $orderId)
                    ->where('status', 'pending')
                    ->update([
                        'status'  => 'paid',
                        'paid_at' => now(),
                    ]);
        }

        // handle other events as needed …

        return response('OK', 200);
    }
}
