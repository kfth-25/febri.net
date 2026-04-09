<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'billing',
        'outage',
        'request',
        'email_enabled',
        'quiet_hours',
    ];

    protected $casts = [
        'billing' => 'boolean',
        'outage' => 'boolean',
        'request' => 'boolean',
        'email_enabled' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
