<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topologi extends Model
{
    use HasFactory;
    protected $table = 'topologis';
    protected $fillable = ['lokasi', 'jenis', 'perangkat', 'bandwidth', 'status', 'uptime'];
    protected $casts = ['perangkat' => 'array']; 
}
