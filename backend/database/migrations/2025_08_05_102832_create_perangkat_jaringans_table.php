<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('perangkat_jaringans', function (Blueprint $table) {
            $table->id();
            $table->string('kategori');
            $table->string('brand');
            $table->string('model');
            $table->integer('jumlah');
            $table->string('lokasi');
            $table->string('kondisi');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('perangkat_jaringans'); }
};
