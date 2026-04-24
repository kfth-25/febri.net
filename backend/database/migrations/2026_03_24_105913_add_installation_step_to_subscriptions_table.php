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
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->enum('installation_step', ['pending', 'scheduled', 'installing', 'done'])
                  ->default('pending')
                  ->after('status');
            $table->timestamp('scheduled_at')->nullable()->after('installation_step');
            $table->string('technician_notes')->nullable()->after('scheduled_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn(['installation_step', 'scheduled_at', 'technician_notes']);
        });
    }
};
