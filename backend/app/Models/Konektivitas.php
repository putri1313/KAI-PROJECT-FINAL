<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Konektivitas extends Model
{
    use HasFactory;
    protected $table = 'konektivitas'; 
    protected $fillable = ['provider', 'jenis', 'bandwidth', 'coverage', 'sla', 'status'];
}
