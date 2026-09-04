<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('info_geo_strategis', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->json('points');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('info_geo_strategis'); }
};
