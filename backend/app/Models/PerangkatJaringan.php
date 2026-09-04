<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerangkatJaringan extends Model
{
    use HasFactory;
    protected $table = 'perangkat_jaringans';
    protected $fillable = ['kategori', 'brand', 'model', 'jumlah', 'lokasi', 'kondisi'];
}
