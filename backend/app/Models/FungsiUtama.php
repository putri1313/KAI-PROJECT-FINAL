<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FungsiUtama extends Model
{
    use HasFactory;

    protected $table = 'fungsi_utama';

    protected $fillable = [
        'profil_divisi_id',
        'title',
        'description',
    ];
}
