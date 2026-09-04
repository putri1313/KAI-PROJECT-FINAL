<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class StrukturOrganisasi extends Model
{
    use HasFactory;
    protected $table = 'struktur_organisasi';

    protected $fillable = [
        'file_path',
        'original_name',
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
