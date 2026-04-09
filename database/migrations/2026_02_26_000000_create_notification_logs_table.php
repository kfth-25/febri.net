<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notification_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('topic')->nullable();
            $table->string('type')->nullable(); // billing_due | payment_received | outage | request_update | email
            $table->string('channel')->nullable(); // push | email
            $table->string('title')->nullable();
            $table->text('body')->nullable();
            $table->string('status')->nullable(); // sent | skipped | error
            $table->string('reason')->nullable(); // preference_disabled | quiet_hours | no_tokens | other
            $table->integer('provider_status')->nullable();
            $table->json('provider_body')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_logs');
    }
};

