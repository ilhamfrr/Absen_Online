<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    public function index()
    {
        $attendances = Attendance::where('user_id', Auth::id())
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Attendance history retrieved',
            'data' => $attendances
        ]);
    }

    public function stats()
    {
        $user = Auth::user();
        $totalPresent = Attendance::where('user_id', $user->id)->count();
        $totalLate = Attendance::where('user_id', $user->id)->where('status', 'late')->count();
        
        // This is simplified stats for the individual employee
        return response()->json([
            'success' => true,
            'data' => [
                'total_present' => $totalPresent,
                'total_late' => $totalLate,
                'last_attendance' => Attendance::where('user_id', $user->id)->orderBy('date', 'desc')->first()
            ]
        ]);
    }

    public function checkIn(Request $request)
    {
        $request->validate([
            'lat' => 'required|numeric',
            'long' => 'required|numeric',
        ]);

        $user = Auth::user();
        $today = Carbon::today()->toDateString();

        // Check if already checked in today
        $existingRecord = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if ($existingRecord && $existingRecord->check_in) {
            return response()->json([
                'success' => false,
                'message' => 'You have already checked in today.'
            ], 422);
        }

        // Distance validation (Haversine)
        $distance = $this->calculateDistance(
            $request->lat,
            $request->long,
            $user->office_lat ?? -6.200000, // Default to dummy office if not set
            $user->office_long ?? 106.816666
        );

        if ($distance > 0.1) { // 100 meters = 0.1 km
            return response()->json([
                'success' => false,
                'message' => 'You are too far from the office (' . round($distance * 1000) . 'm). Must be within 100m.'
            ], 422);
        }

        $attendance = Attendance::updateOrCreate(
            ['user_id' => $user->id, 'date' => $today],
            [
                'check_in' => Carbon::now(),
                'lat' => $request->lat,
                'long' => $request->long,
                'status' => Carbon::now()->hour > 9 ? 'late' : 'present' // Dummy late logic (after 9 AM)
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Check-in successful',
            'data' => $attendance
        ]);
    }

    public function checkOut(Request $request)
    {
        $user = Auth::user();
        $today = Carbon::today()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if (!$attendance || !$attendance->check_in) {
            return response()->json([
                'success' => false,
                'message' => 'Please check in first.'
            ], 422);
        }

        if ($attendance->check_out) {
            return response()->json([
                'success' => false,
                'message' => 'You have already checked out today.'
            ], 422);
        }

        $attendance->update([
            'check_out' => Carbon::now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Check-out successful',
            'data' => $attendance
        ]);
    }

    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // km

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
