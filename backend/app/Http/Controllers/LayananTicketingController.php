<?php

namespace App\Http\Controllers;

use App\Models\TicketingPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class LayananTicketingController extends Controller
{
    /**
     * Menampilkan semua data titik layanan.
     */
    public function index()
    {
        // <<< PERBAIKAN DI SINI >>>
        // Bungkus hasil query dalam sebuah objek dengan key 'points'
        // agar sesuai dengan format yang diharapkan oleh frontend React.
        $points = TicketingPoint::latest()->get();
        return response()->json(['points' => $points]);
    }

    /**
     * Menyimpan atau mengganti semua data titik layanan.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'points' => 'present|array',
            'points.*.lokasi' => 'required|string|max:255',
            'points.*.alamat' => 'required|string|max:255',
            'points.*.total_counter' => 'required|integer|min:0',
            'points.*.counter_aktif' => 'required|integer|min:0|lte:points.*.total_counter',
            'points.*.jenis_layanan' => 'present|array'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $pointsData = $validator->validated()['points'];

        DB::beginTransaction();
        try {
            // PENJELASAN: Baris ini adalah penyebab mengapa data lama di database
            // selalu hilang. Logikanya adalah "hapus semua, lalu masukkan semua yang baru".
            // Ini adalah metode sinkronisasi yang valid sesuai dengan cara kerja frontend Anda saat ini.
            TicketingPoint::query()->delete();

            // Masukkan data baru jika ada
            if (!empty($pointsData)) {
                $timestamp = now();
                
                $insertData = array_map(function($point) use ($timestamp) {
                    $point['jenis_layanan'] = json_encode($point['jenis_layanan']);
                    $point['created_at'] = $timestamp;
                    $point['updated_at'] = $timestamp;
                    return $point;
                }, $pointsData);

                TicketingPoint::insert($insertData);
            }

            DB::commit();

            return response()->json(['message' => 'Semua data berhasil disimpan'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat menyimpan data', 'error' => $e->getMessage()], 500);
        }
    }
}
