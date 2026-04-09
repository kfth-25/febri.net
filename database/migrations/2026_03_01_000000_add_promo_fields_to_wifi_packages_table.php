<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('wifi_packages', function (Blueprint $table) {
            $table->boolean('is_recommended')->default(false)->after('is_active');
            $table->string('promo_label')->nullable()->after('is_recommended');
            $table->decimal('original_price', 10, 2)->nullable()->after('price');
            $table->decimal('promo_price', 10, 2)->nullable()->after('original_price');
            $table->date('badge_new_until')->nullable()->after('promo_label');
        });
    }

    public function down(): void
    {
        Schema::table('wifi_packages', function (Blueprint $table) {
            $table->dropColumn(['is_recommended', 'promo_label', 'original_price', 'promo_price', 'badge_new_until']);
        });
    }
};

