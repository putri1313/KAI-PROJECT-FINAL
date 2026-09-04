<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class WilayahOperasional extends Model {
    use HasFactory;
    protected $fillable = ['provinsi', 'ibuKota', 'luas', 'stasiun', 'jalurUtama', 'kotaPenting', 'koordinat'];
    protected $casts = ['jalurUtama' => 'array', 'kotaPenting' => 'array'];
}

