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
        Schema::table('topologis', function (Blueprint $table) {
            // Mengubah kolom agar bisa menerima nilai null (opsional)
            $table->string('bandwidth')->nullable()->change();
            $table->string('uptime')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('topologis', function (Blueprint $table) {
            // Mengembalikan kolom ke kondisi semula jika di-rollback
            $table->string('bandwidth')->nullable(false)->change();
            $table->string('uptime')->nullable(false)->change();
        });
    }
};
