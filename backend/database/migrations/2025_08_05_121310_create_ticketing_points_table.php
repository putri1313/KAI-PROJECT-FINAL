<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ticketing_points', function (Blueprint $table) {
            $table->id();
            $table->string('lokasi');
            $table->string('alamat');
            $table->integer('total_counter')->default(0);
            $table->integer('counter_aktif')->default(0);
            $table->json('jenis_layanan')->nullable(); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ticketing_points');
    }
};
