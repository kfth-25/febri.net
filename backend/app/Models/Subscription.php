<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $table = 'pemasangan';

    protected $fillable = [
        'user_id',
        'wifi_package_id',
        'status',
        'installation_step',
        'installation_address',
        'installation_date',
        'activated_at',
        'expires_at',
        'notes',
        'scheduled_at',
        'technician_notes',
        'technician_id',
        'map_link',
    ];

    protected $casts = [
        'installation_date' => 'date',
        'activated_at' => 'datetime',
        'expires_at' => 'datetime',
        'scheduled_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function wifiPackage()
    {
        return $this->belongsTo(WifiPackage::class);
    }

    public function technician()
    {
        return $this->belongsTo(User::class, 'technician_id');
    }
}
