<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InfrastrukturPendukung extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'list'];
    protected $casts = ['list' => 'array'];
}
