<?php

namespace App\Http\Controllers;

use App\Models\AplikasiInternal;
use App\Models\InfrastrukturPendukung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AplikasiInternalController extends Controller
{
   
    public function index()
    {
        return response()->json([
            'apps' => AplikasiInternal::all(),
            'infra' => InfrastrukturPendukung::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'apps' => 'present|array',
            'infra' => 'present|array',
            'metrics' => 'present|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            AplikasiInternal::query()->delete();
            foreach ($request->input('apps', []) as $data) {
                AplikasiInternal::create($data);
            }

            InfrastrukturPendukung::query()->delete();
            foreach ($request->input('infra', []) as $data) {
                InfrastrukturPendukung::create([
                    'title' => $data['title'],
                    'list' => $data['list'],
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Data Aplikasi Internal berhasil disimpan!']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal menyimpan data', 'error' => $e->getMessage()], 500);
        }
    }
}
