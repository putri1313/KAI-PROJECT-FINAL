<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ProfilDivisi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProfilDivisiController extends Controller
{
    public function show()
    {
        $profile = ProfilDivisi::with(['fungsi', 'TanggungJawab'])->first();

        if (!$profile) {
            return response()->json(['message' => 'Profil tidak ditemukan'], 404);
        }

        $formattedData = [
            'deskripsi' => $profile->deskripsi,
            'tahun' => $profile->tahun_pembentukan,
            'lokasi' => $profile->lokasi_kantor_pusat,
            'fungsi' => $profile->fungsi->map(function ($item) {
                return [
                    'title' => $item->title,
                    'desc' => $item->description,
                ];
            }),
            'tanggungjawab' => $profile->TanggungJawab->map(function ($item) {
                return [
                    'title' => $item->title,
                    'items' => $item->items,
                ];
            }),
            'kontak' => [
                'alamat' => $profile->kontak_alamat,
                'telepon' => $profile->kontak_telepon,
                'email' => $profile->kontak_email,
            ],
        ];

        return response()->json($formattedData);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'deskripsi' => 'required|string',
            'tahun' => 'required|string|max:4',
            'lokasi' => 'required|string',
            'fungsi' => 'present|array',
            'fungsi.*.title' => 'required|string',
            'fungsi.*.desc' => 'required|string',
            'tanggungjawab' => 'present|array',
            'tanggungjawab.*.title' => 'required|string',
            'tanggungjawab.*.items' => 'present|array',
            'kontak.alamat' => 'required|string',
            'kontak.telepon' => 'required|string',
            'kontak.email' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();
        try {

            $profile = ProfilDivisi::first() ?? new ProfilDivisi();

            $profile->fill([
                'deskripsi' => $request->input('deskripsi'),
                'tahun_pembentukan' => $request->input('tahun'),
                'lokasi_kantor_pusat' => $request->input('lokasi'),
                'kontak_alamat' => $request->input('kontak.alamat'),
                'kontak_telepon' => $request->input('kontak.telepon'),
                'kontak_email' => $request->input('kontak.email'),
            ]);
            $profile->save();

            $profile->fungsi()->delete();
            $profile->TanggungJawab()->delete();

            foreach ($request->input('fungsi', []) as $fungsiData) {
                $profile->fungsi()->create([
                    'title' => $fungsiData['title'],
                    'description' => $fungsiData['desc'],
                ]);
            }

            foreach ($request->input('tanggungjawab', []) as $tanggungJawabData) {
                $profile->TanggungJawab()->create([
                    'title' => $tanggungJawabData['title'],
                    'items' => $tanggungJawabData['items'],
                ]);
            }

            DB::commit(); 

            return response()->json(['message' => 'Data profil berhasil diperbarui!']);

        } catch (\Exception $e) {
            DB::rollBack(); 
            return response()->json(['message' => 'Gagal menyimpan data', 'error' => $e->getMessage()], 500);
        }
    }
}