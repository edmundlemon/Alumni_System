<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('event_title');
            $table->mediumText('description');
            $table->string('location');
            $table->date('event_date');
            $table->time('event_time');
            $table->bigInteger('max_participant')->nullable();
            $table->date('registration_close_date');
            $table->string('status')->default('upcoming');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // $table->foreignId('major_id')->constrained()->onDelete('cascade');
            // $table->foreignId('admin_id')->constrained()->onDelete('cascade');
            // $table->string('event_approval_comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
