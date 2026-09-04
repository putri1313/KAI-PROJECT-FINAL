<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class InfrastrukturPenting extends Model {
    use HasFactory;
    protected $fillable = ['nama', 'tipe', 'fungsi', 'fasilitas', 'koordinat'];
    protected $casts = ['fasilitas' => 'array'];
}