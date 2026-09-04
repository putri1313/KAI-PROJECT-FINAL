<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class JalurKereta extends Model {
    use HasFactory;
    protected $fillable = ['nama', 'rute', 'panjang', 'tipeRel', 'status', 'stasiun', 'layanan', 'kecepatan'];
    protected $casts = ['stasiun' => 'array', 'layanan' => 'array'];
}
