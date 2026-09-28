<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display posts with search, sorting, date filtering,
     * pagination and featured filtering.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $sort = $request->input('sort', 'latest');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $featured = $request->input('featured');
        $perPage = (int) $request->input('per_page', 6);

        $allowedPerPage = [6, 12, 24, 48];

        if (!in_array($perPage, $allowedPerPage, true)) {
            $perPage = 6;
        }

        $query = Post::query();

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                    ->orWhere('content', 'like', '%' . $search . '%');
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Date From
        |--------------------------------------------------------------------------
        */
        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        /*
        |--------------------------------------------------------------------------
        | Date To
        |--------------------------------------------------------------------------
        */
        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        /*
        |--------------------------------------------------------------------------
        | Featured Filter
        |--------------------------------------------------------------------------
        */
        if ($featured === '1') {
            $query->where('featured', true);
        }

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */
        match ($sort) {
            'oldest' => $query->oldest(),

            'title_asc' => $query->orderBy('title', 'asc'),

            'title_desc' => $query->orderBy('title', 'desc'),

            'longest' => $query->orderByRaw(
                'CHAR_LENGTH(content) DESC'
            ),

            'shortest' => $query->orderByRaw(
                'CHAR_LENGTH(content) ASC'
            ),

            default => $query->latest(),
        };

        $posts = $query
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Posts/Index', [
            'posts' => $posts,

            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'featured' => $featured,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Statistics dashboard.
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

        $featuredPosts = Post::where(
            'featured',
            true
        )->count();

        $averageContentLength = round(
            Post::query()
                ->selectRaw(
                    'AVG(CHAR_LENGTH(content)) as average_length'
                )
                ->value('average_length') ?? 0
        );

        $averageWordCount = round(
            Post::query()
                ->selectRaw(
                    'AVG(CHAR_LENGTH(content) - CHAR_LENGTH(REPLACE(content, " ", "")) + 1) as average_words'
                )
                ->value('average_words') ?? 0
        );

        $latestPost = Post::latest()->first();

        $longestPost = Post::orderByRaw(
            'CHAR_LENGTH(content) DESC'
        )->first();

        $topLongestPosts = Post::orderByRaw(
            'CHAR_LENGTH(content) DESC'
        )
            ->take(5)
            ->get();

        $recentPosts = Post::latest()
            ->take(7)
            ->get();

        return Inertia::render('Posts/Statistics', [
            'statistics' => [
                'total' => $totalPosts,
                'today' => $todayPosts,
                'week' => $thisWeekPosts,
                'month' => $thisMonthPosts,
                'featured' => $featuredPosts,
                'averageContentLength' => $averageContentLength,
                'averageWordCount' => $averageWordCount,
            ],

            'latestPost' => $latestPost,

            'longestPost' => $longestPost,

            'topLongestPosts' => $topLongestPosts,

            'recentPosts' => $recentPosts,
        ]);
    }

    /**
     * Create form.
     */
    public function create()
    {
        return Inertia::render('Posts/Create');
    }

    /**
     * Store post.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],

            'content' => [
                'required',
                'string',
                'min:4',
            ],

            'featured' => [
                'nullable',
                'boolean',
            ],
        ]);

        $validated['featured'] =
            $request->boolean('featured');

        Post::create($validated);

        return redirect()
            ->route('posts.index')
            ->with(
                'success',
                'Post created successfully.'
            );
    }

    /**
     * Display post.
     */
    public function show(Post $post)
    {
        return Inertia::render('Posts/Show', [
            'post' => $post,
        ]);
    }

    /**
     * Edit form.
     */
    public function edit(Post $post)
    {
        return Inertia::render('Posts/Edit', [
            'post' => $post,
        ]);
    }

    /**
     * Update post.
     */
    public function update(
        Request $request,
        Post $post
    ) {
        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],

            'content' => [
                'required',
                'string',
                'min:4',
            ],

            'featured' => [
                'nullable',
                'boolean',
            ],
        ]);

        $validated['featured'] =
            $request->boolean('featured');

        $post->update($validated);

        return redirect()
            ->route('posts.index')
            ->with(
                'success',
                'Post updated successfully.'
            );
    }

    /**
     * Delete one post.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()
            ->route('posts.index')
            ->with(
                'success',
                'Post deleted successfully.'
            );
    }

    /**
     * Bulk delete.
     */
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => [
                'required',
                'array',
                'min:1',
            ],

            'ids.*' => [
                'integer',
                'exists:posts,id',
            ],
        ]);

        $count = Post::whereIn(
            'id',
            $validated['ids']
        )->delete();

        return redirect()
            ->route('posts.index')
            ->with(
                'success',
                "{$count} post(s) deleted successfully."
            );
    }

    /**
     * Duplicate a post.
     */
    public function duplicate(Post $post)
    {
        $copy = $post->replicate();

        $copy->title =
            $post->title . ' (Copy)';

        $copy->featured = false;

        $copy->save();

        return redirect()
            ->route(
                'posts.edit',
                $copy
            )
            ->with(
                'success',
                'Post duplicated successfully.'
            );
    }

    /**
     * Toggle featured status.
     */
    public function toggleFeatured(Post $post)
    {
        $post->update([
            'featured' => !$post->featured,
        ]);

        return back()->with(
            'success',
            $post->featured
                ? 'Post marked as featured.'
                : 'Post removed from featured posts.'
        );
    }

    /**
     * Export posts to CSV.
     */
    public function export(Request $request)
    {
        $query = Post::query();

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where(
                    'title',
                    'like',
                    '%' . $search . '%'
                )
                    ->orWhere(
                        'content',
                        'like',
                        '%' . $search . '%'
                    );
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate(
                'created_at',
                '>=',
                $request->date_from
            );
        }

        if ($request->filled('date_to')) {
            $query->whereDate(
                'created_at',
                '<=',
                $request->date_to
            );
        }

        $posts = $query
            ->latest()
            ->get();

        $filename =
            'posts-' .
            now()->format('Y-m-d-H-i-s') .
            '.csv';

        $headers = [
            'Content-Type' =>
                'text/csv; charset=UTF-8',

            'Content-Disposition' =>
                'attachment; filename="' .
                $filename .
                '"',
        ];

        $callback = function () use ($posts) {
            $file = fopen(
                'php://output',
                'w'
            );

            fprintf(
                $file,
                chr(0xEF) .
                chr(0xBB) .
                chr(0xBF)
            );

            fputcsv($file, [
                'ID',
                'Title',
                'Content',
                'Featured',
                'Word Count',
                'Reading Time',
                'Created At',
                'Updated At',
            ]);

            foreach ($posts as $post) {
                fputcsv($file, [
                    $post->id,
                    $post->title,
                    $post->content,
                    $post->featured
                        ? 'Yes'
                        : 'No',
                    $post->word_count,
                    $post->reading_time .
                        ' minute(s)',
                    $post->created_at,
                    $post->updated_at,
                ]);
            }

            fclose($file);
        };

        return Response::stream(
            $callback,
            200,
            $headers
        );
    }
}