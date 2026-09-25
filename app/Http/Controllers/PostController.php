<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display posts with search, filtering, sorting and pagination.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $sort = $request->input('sort', 'latest');

        $query = Post::query();

        // Search by title or content
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                    ->orWhere('content', 'like', '%' . $search . '%');
            });
        }

        // Sorting
        match ($sort) {
            'oldest' => $query->oldest(),
            'title_asc' => $query->orderBy('title', 'asc'),
            'title_desc' => $query->orderBy('title', 'desc'),
            default => $query->latest(),
        };

        $posts = $query
            ->paginate(6)
            ->withQueryString();

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Display post statistics dashboard.
     */
    public function statistics()
    {
        $totalPosts = Post::count();

        $todayPosts = Post::whereDate(
            'created_at',
            today()
        )->count();

        $thisWeekPosts = Post::whereBetween(
            'created_at',
            [
                now()->startOfWeek(),
                now()->endOfWeek(),
            ]
        )->count();

        $thisMonthPosts = Post::whereMonth(
            'created_at',
            now()->month
        )
            ->whereYear(
                'created_at',
                now()->year
            )
            ->count();

        $latestPost = Post::latest()->first();

        $averageContentLength = round(
            Post::query()
                ->selectRaw(
                    'AVG(CHAR_LENGTH(content)) as average_length'
                )
                ->value('average_length') ?? 0
        );

        $longestPost = Post::orderByRaw(
            'CHAR_LENGTH(content) DESC'
        )->first();

        return Inertia::render('Posts/Statistics', [
            'statistics' => [
                'total' => $totalPosts,
                'today' => $todayPosts,
                'week' => $thisWeekPosts,
                'month' => $thisMonthPosts,
                'averageContentLength' => $averageContentLength,
            ],
            'latestPost' => $latestPost,
            'longestPost' => $longestPost,
        ]);
    }

    /**
     * Show the create post form.
     */
    public function create()
    {
        return Inertia::render('Posts/Create');
    }

    /**
     * Store a new post.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'content' => ['required', 'string', 'min:4'],
        ]);

        Post::create($validated);

        return redirect()
            ->route('posts.index')
            ->with('success', 'Post created successfully.');
    }

    /**
     * Display a single post.
     */
    public function show(Post $post)
    {
        return Inertia::render('Posts/Show', [
            'post' => $post,
        ]);
    }

    /**
     * Show the edit post form.
     */
    public function edit(Post $post)
    {
        return Inertia::render('Posts/Edit', [
            'post' => $post,
        ]);
    }

    /**
     * Update an existing post.
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'content' => ['required', 'string', 'min:4'],
        ]);

        $post->update($validated);

        return redirect()
            ->route('posts.index')
            ->with('success', 'Post updated successfully.');
    }

    /**
     * Delete the selected post.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()
            ->route('posts.index')
            ->with('success', 'Post deleted successfully.');
    }
}