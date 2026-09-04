<?php

namespace App\Http\Controllers;

use App\Models\Cctv;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CctvController extends Controller
{

    public function index()
    {
        return response()->json([
            'cctvs' => Cctv::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cctvs' => 'present|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
                Cctv::query()->delete();
                foreach ($request->input('cctvs', []) as $data) {
                    Cctv::create([
                    'lokasi' => $data['lokasi'],
                    'kategori' => $data['kategori'],
                    'active' => $data['active'],
                    'maintenance' => $data['maintenance'],
                    'offline' => $data['offline'],  
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Data CCTV dan Jadwal Maintenance berhasil disimpan!']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal menyimpan data', 'error' => $e->getMessage()], 500);
        }
    }
}