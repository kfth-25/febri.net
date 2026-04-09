<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'topic',
        'type',
        'channel',
        'title',
        'body',
        'status',
        'reason',
        'provider_status',
        'provider_body',
    ];

    protected $casts = [
        'provider_body' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

