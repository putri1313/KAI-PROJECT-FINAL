<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProfilDivisi extends Model    
{
    use HasFactory;

    protected $table = 'profil_divisi'; 

     protected $fillable =  [
        'deskripsi',
        'tahun_pembentukan',
        'lokasi_kantor_pusat',
        'kontak_alamat',
        'kontak_telepon',
        'kontak_email',
    ];

    public function fungsi(): HasMany
    {
        return $this->hasMany(FungsiUtama::class);
    }

     public function TanggungJawab(): HasMany
    {
        return $this->hasMany(TanggungJawab::class);
    }

}
