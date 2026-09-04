<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TanggungJawab extends Model
{
    use HasFactory;

    protected $table = 'tanggung_jawab';

    protected $fillable = [
        'profil_divisi_id',
        'title',
        'items',
    ];

    protected $casts = [
        'items' => 'array',
    ];
}
