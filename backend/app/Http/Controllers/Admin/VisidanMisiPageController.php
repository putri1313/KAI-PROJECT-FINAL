<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kpi;
use App\Models\Misi;
use App\Models\SasaranMutu;
use App\Models\Visi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class VisidanMisiPageController extends Controller
{
    public function index()
    {
        $data = [
            'visi' => Visi::first(),
            'misi' => Misi::all(),
            'kpi' => Kpi::all(),
            'sasaran_mutu' => SasaranMutu::all(),
        ];
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'visi' => 'present|array',
            'visi.content' => 'required|string',
            'misi' => 'present|array',
            'kpi' => 'present|array',
            'kpi.*.target' => 'required|string',
            'kpi.*.value' => 'required|string',
            'kpi.*.achievement' => 'required|string',
            'kpi.*.description' => 'required|string',
            'sasaran_mutu' => 'present|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Memulai transaksi database, sama seperti di ProfilDivisiController
        DB::beginTransaction();
        try {
            // 1. Mengelola Visi (sama seperti sebelumnya)
            $visi = Visi::first() ?? new Visi();
            $visi->content = $request->input('visi.content');
            $visi->save();

            // 2. Mengelola Misi
            // MENGHAPUS SEMUA DATA DENGAN CARA YANG AMAN (DELETE statt TRUNCATE)
            Misi::query()->delete(); 
            foreach ($request->input('misi', []) as $misiData) {
                Misi::create($misiData);
            }
            
            // 3. Mengelola KPI
            // MENGHAPUS SEMUA DATA DENGAN CARA YANG AMAN
            Kpi::query()->delete(); 
            foreach ($request->input('kpi', []) as $kpiData) {
                Kpi::create($kpiData);
            }
            
            // 4. Mengelola Sasaran Mutu
            // MENGHAPUS SEMUA DATA DENGAN CARA YANG AMAN
            SasaranMutu::query()->delete(); 
            foreach ($request->input('sasaran_mutu', []) as $sasaranData) {
                SasaranMutu::create($sasaranData);
            }

            // Jika semua berhasil, commit transaksi
            DB::commit();
            return response()->json(['message' => 'Data Visi, Misi, KPI, dan Sasaran Mutu berhasil disimpan!']);

        } catch (\Exception $e) {
            // Jika terjadi error di manapun, batalkan semua perubahan
            DB::rollBack(); 
            
            // Kembalikan pesan error yang detail untuk debugging
            return response()->json([
                'message' => 'Gagal menyimpan data, terjadi error di backend!',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
}