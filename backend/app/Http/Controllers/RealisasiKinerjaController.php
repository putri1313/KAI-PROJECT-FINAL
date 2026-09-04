<?php

namespace App\Http\Controllers;

use App\Models\ProgramRealisasiKinerjaIT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RealisasiKinerjaController extends Controller
{

    public function index(Request $request)
    {
         $query = ProgramRealisasiKinerjaIT::query();

         $query->when($request->input('tahun'), function ($q, $tahun) {
             if ($tahun !== 'all') {
                return $q->where('tahun', $tahun);
            }
        });

          $query->when($request->input('capaian'), function ($q, $capaian) {
            return $q->where('capaian', '>=', $capaian);
        });

        $kinerja = $query->get();

        return response()->json([
            'kinerja' => $kinerja,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kinerja' => 'present|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
                ProgramRealisasiKinerjaIT::query()->delete();
                foreach ($request->input('kinerja', []) as $data) {
                    ProgramRealisasiKinerjaIT::create([
                    'tahun' => $data['tahun'],
                    'capaian' => $data['capaian'],
                    'deskripsi' => $data['deskripsi'],  
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Data Program Realisasi Kerja berhasil disimpan!']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal menyimpan data', 'error' => $e->getMessage()], 500);
        }
    }
}