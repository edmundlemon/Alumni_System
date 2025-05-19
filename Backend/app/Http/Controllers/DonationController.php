<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;

class DonationController extends Controller
{
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
    public function createOrder(Request $request)
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
            'receipt'         => 'rcpt_'.Str::uuid(),
            'payment_capture' => 1,  // auto‑capture
            // you can add arbitrary notes
        ]);

        // ④  Persist in DB so we can match webhooks later
        $donation = Donation::create([
            'user_id'           => Auth::guard('sanctum')->id,               // or null / guest
            'donated_amount'      => $amountCents,
            'currency'          => 'SGD',
            'razorpay_order_id' => $rzpOrder['id'],
            'status'            => 'pending',                  // enum: pending|paid|failed
        ]);

        // ⑤  Send data back to the browser that will open Checkout
        return response()->json([
            'key'         => config('services.razorpay.key'),
            'orderId'     => $rzpOrder['id'],
            'amountCents' => $rzpOrder['amount'],
            'donationId'  => $donation->id,   // keep a handle on our record
        ]);
    }

    /* POST /api/donations/verify-payment
       Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature } */
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'razorpay_order_id'   => 'required',
            'razorpay_payment_id' => 'required',
            'razorpay_signature'  => 'required',
        ]);

        // ⑥  Verify signature
        $sig = hash_hmac(
            'sha256',
            $request->razorpay_order_id.'|'.$request->razorpay_payment_id,
            config('services.razorpay.secret')
        );

        if ($sig !== $request->razorpay_signature) {
            return response()->json(['error' => 'Signature mismatch'], 400);
        }

        // ⑦  Mark donation as paid
        $donation = Donation::where('razorpay_order_id', $request->razorpay_order_id)->firstOrFail();
        $donation->update([
            'razorpay_payment_id' => $request->razorpay_payment_id,
            'razorpay_signature'  => $request->razorpay_signature,
            'status'              => 'paid',
            'paid_at'             => now(),
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
