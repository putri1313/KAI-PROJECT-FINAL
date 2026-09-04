<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class ProgramRealisasiKinerjaIT extends Model
{
    use HasFactory;
    protected $table = 'program_realisasi_kinerja_i_t_s';
    protected $fillable = ['tahun', 'capaian', 'deskripsi'];
}
