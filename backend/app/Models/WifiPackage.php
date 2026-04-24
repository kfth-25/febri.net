<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WifiPackage extends Model
{
    protected $fillable = [
        'name',
        'speed',
        'price',
        'description',
        'is_active',
        'is_recommended',
        'promo_label',
        'original_price',
        'promo_price',
        'badge_new_until',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'promo_price' => 'decimal:2',
        'is_recommended' => 'boolean',
        'badge_new_until' => 'date',
    ];

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
