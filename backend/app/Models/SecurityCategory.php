<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityCategory extends Model {
    use HasFactory;
    protected $table = 'security_categories'; 
    protected $fillable = ['kategori', 'items'];
    protected $casts = ['items' => 'array']; 
}
