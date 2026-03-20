<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'office_lat' => -6.200000,
                'office_long' => 106.816666,
            ]
        );

        User::updateOrCreate(
            ['email' => 'employee@test.com'],
            [
                'name' => 'Test Employee',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'office_lat' => -6.200000,
                'office_long' => 106.816666,
            ]
        );
    }
}
