<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\StrukturOrganisasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StrukturOrganisasiController extends Controller
{
    public function show()
    {
        $struktur = StrukturOrganisasi::first();

        if (!$struktur) {
            return response()->json(['message' => 'Gambar struktur organisasi tidak ditemukan.'], 404);
        }

        return response()->json($struktur);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        $file = $request->file('image');
        $originalName = $file->getClientOriginalName();
        $fileName = 'struktur-' . time() . '.' . $file->getClientOriginalExtension();
        
       $struktur = StrukturOrganisasi::first() ?? new StrukturOrganisasi();

        // 2. Hapus file lama jika ada
        if ($struktur->exists && $struktur->file_path) {
            Storage::disk('public')->delete($struktur->file_path);
        }
        
        // 3. Simpan file baru
        $path = $file->storeAs('struktur', $fileName, 'public');

        // 4. Isi data dan simpan (ini akan UPDATE jika sudah ada, atau CREATE jika baru)
        $struktur->file_path = $path;
        $struktur->original_name = $originalName;
        $struktur->save();

        return response()->json([
            'message' => 'Gambar struktur berhasil diunggah!',
            'data' => $struktur // Kirim kembali data yang sudah tersimpan
        ], 201);
    }

    public function destroy()
    {
        $struktur = StrukturOrganisasi::first();

        if (!$struktur) {
            return response()->json(['message' => 'Gambar struktur organisasi tidak ditemukan.'], 404);
        }

        Storage::disk('public')->delete($struktur->file_path);


        $struktur->delete();

        return response()->json(['message' => 'Gambar struktur berhasil dihapus.']);
    }
}
