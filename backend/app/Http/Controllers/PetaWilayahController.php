<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PetaInteraktifWilayah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PetaWilayahController extends Controller
{
    public function index()
    {
        $struktur = PetaInteraktifWilayah::first();

        if (!$struktur) {
            return response()->json(['message' => 'Peta Wilayah tidak dapat ditemukan'], 404);
        }

        // PERBAIKAN: Bungkus respons di dalam key 'peta' agar sesuai dengan frontend
        return response()->json(['peta' => $struktur]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        $file = $request->file('image');
        $petaName = $file->getClientOriginalName();
        $fileName = 'peta-' . time() . '.' . $file->getClientOriginalExtension();
        
        $struktur = PetaInteraktifWilayah::first() ?? new PetaInteraktifWilayah();

        // 2. Hapus file lama jika ada
        if ($struktur->exists && $struktur->file_path) {
            Storage::disk('public')->delete($struktur->file_path);
        }
        
        // 3. Simpan file baru
        $path = $file->storeAs('peta', $fileName, 'public');

        // 4. Isi data dan simpan (ini akan UPDATE jika sudah ada, atau CREATE jika baru)
        $struktur->file_path = $path;
        $struktur->peta_name = $petaName;
        $struktur->save();

        return response()->json([
            'message' => 'Peta berhasil di unggah!',
            'data' => $struktur // Kirim kembali data yang sudah tersimpan
        ], 201);
    }

    public function destroy()
    {
        $struktur = PetaInteraktifWilayah::first();

        if (!$struktur) {
            return response()->json(['message' => 'Peta Wilayah tidak ditemukan.'], 404);
        }

        Storage::disk('public')->delete($struktur->file_path);


        $struktur->delete();

        return response()->json(['message' => 'Peta Wilayah berhasi dihapus.']);
    }
}
