<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Controller responsible for handling Post CRUD operations
class PostController extends Controller
{
    // Display all posts on the index page
    public function index()
    {
        return Inertia::render('Posts/Index', [
            'posts' => Post::latest()->get() // Fetch latest posts from database
        ]);
    }

    // Show the create post form
    public function create()
    {
        return Inertia::render('Posts/Create');
    }

    // Store a new post in the database
    public function store(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'title' => 'required',
            'content' => 'required'
        ]);

        // Create a new post record
        Post::create($request->all());

        // Redirect back to posts list page
        return redirect()->route('posts.index');
    }

    // Delete the selected post
    public function destroy(Post $post)
    {
        $post->delete();

        // Redirect back to posts list page after deletion
        return redirect()->route('posts.index');
    }
}