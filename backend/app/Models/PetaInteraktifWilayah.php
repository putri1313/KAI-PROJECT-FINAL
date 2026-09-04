<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class PetaInteraktifWilayah extends Model
{
    use HasFactory;

    // Pastikan nama tabel ini sesuai dengan migrasi Anda
    protected $table = 'peta_interaktif_wilayahs';

    protected $fillable = [
        'file_path',
        'peta_name', // Disesuaikan menjadi snake_case
    ];

    protected $appends = ['image_url'];
    
    public function getImageUrlAttribute(): ?string
    {
        if ($this->file_path && Storage::disk('public')->exists($this->file_path)) {
            return URL::to(Storage::url($this->file_path));
        }
        return null;
    }
}
