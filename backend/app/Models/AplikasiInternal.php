<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AplikasiInternal extends Model
{
    use HasFactory;
    protected $fillable = [
        'nama', 'kategori', 'fungsi', 'keterangan',
    ];
}