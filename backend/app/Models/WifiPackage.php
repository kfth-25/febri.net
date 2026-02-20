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
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
