<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketingPoint extends Model
{
    use HasFactory;
    protected $table = 'ticketing_points';
    protected $fillable = [
        'lokasi',
        'alamat',
        'total_counter',
        'counter_aktif',
        'jenis_layanan',
    ];
    protected $casts = [
        'jenis_layanan' => 'array',
    ];
}
