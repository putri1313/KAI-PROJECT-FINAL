<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('wilayah_operasionals', function (Blueprint $table) {
            $table->id();
            $table->string('provinsi');
            $table->string('ibuKota');
            $table->integer('stasiun');
            $table->json('jalurUtama');
            $table->json('kotaPenting');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('wilayah_operasionals'); }
};