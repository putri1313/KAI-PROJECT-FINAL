<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cctvs', function (Blueprint $table) {
            $table->id();
            $table->string('lokasi');
            $table->string('kategori');
            $table->integer('jumlah')->default(0);
            $table->integer('active')->default(0);
            $table->integer('maintenance')->default(0);
            $table->integer('offline')->default(0);
            $table->string('brand')->nullable();
            $table->string('resolution')->nullable();
            $table->boolean('nightVision')->default(false);
            $table->json('coverage'); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cctvs');
    }
};
