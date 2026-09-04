<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profil_divisi', function (Blueprint $table) {
            $table->id();
            $table->text('deskripsi');
            $table->string('tahun_pembentukan', 4);
            $table->text('lokasi_kantor_pusat');
            $table->text('kontak_alamat');
            $table->text('kontak_telepon');
            $table->text('kontak_email');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profil_divisi');
    }
};
