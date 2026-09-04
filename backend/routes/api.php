<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfilDivisiController;
use App\Http\Controllers\Admin\VisidanMisiPageController;
use App\Http\Controllers\StrukturOrganisasiController;
use App\Http\Controllers\InfrastrukturJaringanController;
use App\Http\Controllers\StasiunController;
use App\Http\Controllers\CctvController;
use App\Http\Controllers\LayananTicketingController;
use App\Http\Controllers\AplikasiInternalController;
use App\Http\Controllers\PetaWilayahController;
use App\Http\Controllers\RealisasiKinerjaController;

     Route::controller(ProfilDivisiController::class)
        ->prefix('profil-divisi') 
        ->as('profil-divisi.') 
        ->group(function () {
            Route::get('/', 'show')->name('show'); 
            Route::post('/update', 'update')->name('update'); 
        });

    Route::controller(VisidanMisiPageController::class)
    ->prefix('visi-misi-page')
    ->as('visimisi.')
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
    });

    Route::controller(StrukturOrganisasiController::class)
    ->prefix('struktur-organisasi')
    ->group(function () {
        Route::get('/', 'show');
        Route::post('/', 'store');
        Route::delete('/', 'destroy');

    });

    Route::controller(InfrastrukturJaringanController::class)
    ->prefix('infrastruktur-jaringan')
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
    });

    Route::apiResource('stasiun', StasiunController::class);

    Route::controller(CctvController::class)
    ->prefix('cctv-data')
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
    });

    Route::controller(LayananTicketingController::class)
    ->prefix('layanan-ticketing')
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
    });

    Route::controller(AplikasiInternalController::class)
    ->prefix('aplikasi-internal')
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
    });

    Route::controller(PetaWilayahController::class)
    ->prefix('peta-wilayah')
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::delete('/', 'destroy');
    });

    Route::controller(RealisasiKinerjaController::class)
    ->prefix('kinerja')
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
    });