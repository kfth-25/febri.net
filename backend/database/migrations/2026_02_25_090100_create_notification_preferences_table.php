<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->boolean('billing')->default(true);
            $table->boolean('outage')->default(true);
            $table->boolean('request')->default(true);
            $table->boolean('email_enabled')->default(true);
            $table->string('quiet_hours')->nullable(); // e.g., "22:00-07:00"
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_preferences');
    }
};
