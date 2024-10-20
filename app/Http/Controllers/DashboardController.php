<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        //$user = auth()->user();
        // $totalPendingTasks = Task::query()
        //     ->where('status', 'pending')
        //     ->count();
        // $myPendingTasks = Task::query()
        //     ->where('status', 'pending')
        //     ->where('assigned_user_id', $user->id)
        //     ->count();

        $totalPendingTasks = 10; // Replace with actual query
        $myPendingTasks = 5; // Replace with actual query



        return inertia('Dashboard', [
            $totalPendingTasks => 'totalPendingTasks',
            $myPendingTasks => 'myPendingTasks'
        ]);
    }
}
