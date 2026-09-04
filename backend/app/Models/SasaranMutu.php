<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SasaranMutu extends Model
{
    use HasFactory;
    protected $table = 'sasaran_mutu';

    protected $fillable = ['kategori', 'items'];
    
    protected $casts = [
        'items' => 'array',
    ];
}