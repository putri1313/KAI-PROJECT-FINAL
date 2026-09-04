<?php

namespace App\Http\Controllers;

use App\Models\Stasiun;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StasiunController extends Controller
{
    public function index(Request $request)
    {
        $query = Stasiun::query();

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('nama', 'like', "%{$searchTerm}%")
                  ->orWhere('kode', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->has('provinsi') && $request->input('provinsi') !== 'all') {
            $query->where('provinsi', $request->input('provinsi'));
        }

        return response()->json($query->get());
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:10|unique:stasiuns,kode',
            'provinsi' => 'required|string',
            'kelas' => 'required|string',
            'jalur' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $stasiun = Stasiun::create($validator->validated());

        return response()->json($stasiun, 201);
    }
    public function show(Stasiun $stasiun)
    {
        return response()->json($stasiun);
    }
    public function update(Request $request, Stasiun $stasiun)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:10|unique:stasiuns,kode,' . $stasiun->id,
            'provinsi' => 'required|string',
            'kelas' => 'required|string',
            'jalur' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $stasiun->update($validator->validated());

        return response()->json($stasiun);
    }
    
    public function destroy(Stasiun $stasiun)
    {
        $stasiun->delete();

        return response()->json(null, 204); 
    }
}
