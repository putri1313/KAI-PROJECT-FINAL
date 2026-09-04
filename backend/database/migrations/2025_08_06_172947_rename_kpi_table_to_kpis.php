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
         Schema::rename('Key_Performance_Indicator(KPI)', 'kpis');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('kpis', 'Key_Performance_Indicator(KPI)');
    }
};
