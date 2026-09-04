<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cctvs', function (Blueprint $table) {
            $table->dropColumn(['brand', 'resolution', 'nightVision', 'coverage', 'jumlah']);
        });
    }

    public function down(): void
    {
        Schema::table('cctvs', function (Blueprint $table) {
            // Kode untuk mengembalikan kolom jika di-rollback
            $table->string('brand')->nullable();
            $table->string('resolution')->nullable();
            $table->boolean('nightVision')->default(false);
            $table->json('coverage')->nullable();
            $table->integer('jumlah')->default(0);
        });
    }
};