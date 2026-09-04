<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('konektivitas', function (Blueprint $table) {
            $table->id();
            $table->string('provider');
            $table->string('jenis');
            $table->string('bandwidth');
            $table->string('status');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('konektivitas'); }
};
