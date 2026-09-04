<?php

namespace App\Http\Controllers;

use App\Models\Konektivitas;
use App\Models\PerangkatJaringan;
use App\Models\SecurityCategory;
use App\Models\Topologi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class InfrastrukturJaringanController extends Controller
{
    public function index()
    {
        return response()->json([
            'topologi' => Topologi::all(),
            'perangkat' => PerangkatJaringan::all(),
            'konektivitas' => Konektivitas::all(),
            'security' => SecurityCategory::all(),
        ]);
    }

    public function store(Request $request)
    {
        // Validasi untuk memastikan data dasar ada
        $validator = Validator::make($request->all(), [
            'topologi' => 'present|array',
            'perangkat' => 'present|array',
            'konektivitas' => 'present|array',
            'security' => 'present|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            // --- PERBAIKAN UTAMA: Mengganti truncate() dengan delete() ---

            Topologi::query()->delete(); 
            foreach ($request->input('topologi', []) as $data) {
                // Hanya ambil kolom yang ada di $fillable untuk mencegah MassAssignmentException
                Topologi::create([
                    'lokasi' => $data['lokasi'],
                    'jenis' => $data['jenis'],
                    'perangkat' => $data['perangkat'],
                    'bandwidth' => $data['bandwidth'],
                    'status' => $data['status'],
                    'uptime' => $data['uptime'],
                ]);
            }

            PerangkatJaringan::query()->delete();
            foreach ($request->input('perangkat', []) as $data) {
                PerangkatJaringan::create([
                    'kategori' => $data['kategori'],
                    'brand' => $data['brand'],
                    'model' => $data['model'],
                    'jumlah' => $data['jumlah'],
                    'lokasi' => $data['lokasi'],
                    'kondisi' => $data['kondisi'],
                ]);
            }

            Konektivitas::query()->delete();
            foreach ($request->input('konektivitas', []) as $data) {
                Konektivitas::create([
                    'provider' => $data['provider'],
                    'jenis' => $data['jenis'],
                    'bandwidth' => $data['bandwidth'],
                    'status' => $data['status'],
                ]);
            }

            SecurityCategory::query()->delete();
            foreach ($request->input('security', []) as $data) {
                SecurityCategory::create([
                    'kategori' => $data['kategori'],
                    'items' => $data['items'],
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Data infrastruktur jaringan berhasil disimpan!']);

        } catch (\Exception $e) {
            DB::rollBack(); 
            
            // Mengirimkan pesan error yang lebih detail untuk debugging
            return response()->json([
                'message' => 'Terjadi error di backend!',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
}
