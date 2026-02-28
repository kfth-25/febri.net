<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IssueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Issue::with(['subscription.wifiPackage', 'reporter', 'technician']);

        if ($user->role === 'admin') {
            // Admin sees all
        } elseif ($user->role === 'technician') {
            // Technician sees assigned issues
            $query->where('technician_id', $user->id);
        } else {
            // Customer sees their own reported issues
            $query->where('reporter_id', $user->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return $query->latest()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, NotificationService $notifier)
    {
        $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'in:low,medium,high,critical',
        ]);

        $issue = Issue::create([
            'subscription_id' => $request->subscription_id,
            'reporter_id' => $request->user()->id,
            'subject' => $request->subject,
            'description' => $request->description,
            'priority' => $request->priority ?? 'medium',
            'status' => 'open',
        ]);

        // Emit outage notification to subscription owner (immediate creation)
        $issue->load('subscription.user');
        $subUser = optional($issue->subscription)->user;
        if ($subUser) {
            $title = $issue->priority === 'critical' ? 'Gangguan Jaringan (Kritis)' : 'Laporan Gangguan Diterima';
            $body = $issue->priority === 'critical'
                ? 'Kami mendeteksi gangguan jaringan pada area layanan Anda. Tim kami sedang menangani.'
                : 'Laporan gangguan Anda telah diterima. Kami akan segera menindaklanjuti.';
            $notifier->sendPushToUser(
                $subUser->id,
                $title,
                $body,
                ['issue_id' => $issue->id, 'priority' => $issue->priority, 'deeplink' => 'app://support/outage?issue_id='.$issue->id],
                'outage'
            );
            $notifier->sendEmail($subUser, $title, $body);
        }

        return response()->json($issue, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Issue $issue)
    {
        $user = Auth::user();

        // Authorization check
        if ($user->role !== 'admin' && 
            $user->role !== 'technician' && 
            $issue->reporter_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $issue->load(['subscription', 'reporter', 'technician']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Issue $issue, NotificationService $notifier)
    {
        $user = $request->user();

        // Authorization logic
        if ($user->role === 'customer' && $issue->reporter_id !== $user->id) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }
        // Customers generally shouldn't update ticket details except maybe closing it?
        // Let's allow Admin and Technician to update status.
        
        $validated = $request->validate([
            'status' => 'in:open,in_progress,resolved,closed',
            'priority' => 'in:low,medium,high,critical',
            'technician_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string' // In case they want to add notes (simplified)
        ]);

        if ($user->role === 'customer') {
             // Customer can only cancel/close
             if (isset($validated['status']) && $validated['status'] !== 'closed') {
                 return response()->json(['message' => 'Customers can only close tickets'], 403);
             }
             // Prevent customer from assigning tech or changing priority
             unset($validated['technician_id']);
             unset($validated['priority']);
        }

        if (isset($validated['status']) && $validated['status'] === 'resolved') {
            $validated['resolved_at'] = now();
        }

        $oldStatus = $issue->status;
        $issue->update($validated);

        // Emit outage status change notifications to subscription owner
        $issue->load('subscription.user');
        $subUser = optional($issue->subscription)->user;
        if ($subUser) {
            if ($oldStatus !== $issue->status) {
                if ($issue->status === 'resolved') {
                    $title = 'Gangguan Dipulihkan';
                    $body = 'Gangguan jaringan pada layanan Anda telah dipulihkan. Terima kasih atas kesabarannya.';
                    $notifier->sendPushToUser(
                        $subUser->id,
                        $title,
                        $body,
                        ['issue_id' => $issue->id, 'priority' => $issue->priority, 'deeplink' => 'app://support/outage?issue_id='.$issue->id],
                        'outage'
                    );
                    $notifier->sendEmail($subUser, $title, $body);
                } elseif ($issue->status === 'in_progress') {
                    $title = 'Penanganan Gangguan Dimulai';
                    $body = 'Teknisi kami sedang menangani gangguan yang Anda laporkan.';
                    $notifier->sendPushToUser(
                        $subUser->id,
                        $title,
                        $body,
                        ['issue_id' => $issue->id, 'priority' => $issue->priority, 'deeplink' => 'app://support/outage?issue_id='.$issue->id],
                        'outage'
                    );
                }
            }
        }

        return response()->json($issue);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Issue $issue)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $issue->delete();
        return response()->json(['message' => 'Issue deleted']);
    }
}
