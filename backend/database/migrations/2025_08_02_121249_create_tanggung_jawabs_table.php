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
        Schema::create('tanggung_jawab', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profil_divisi_id')->constrained('profil_divisi')->onDelete('cascade');
            $table->string('title');
            $table->json('items'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tanggung_jawab');
    }
};
