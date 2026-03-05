#  PHP_Laravel12_Wayfinder

![Laravel](https://img.shields.io/badge/Laravel-12-red)
![React](https://img.shields.io/badge/React-Inertia-blue)
![Wayfinder](https://img.shields.io/badge/Wayfinder-Route%20Helpers-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI-38B2AC)
![CRUD](https://img.shields.io/badge/Example-Post%20CRUD-orange)

A simple **Post CRUD application** built using **Laravel 12**, **React**, and **Inertia.js** with **Wayfinder integration**.

---

#  Overview

This project demonstrates how to build a modern **Laravel + React + Inertia.js** application while integrating **Wayfinder**.

Wayfinder automatically generates **frontend route helper functions** based on Laravel controllers and routes. This removes the need for **hardcoded URLs in the frontend** and makes frontend-backend communication cleaner and safer.

The project includes a simple **Post CRUD system** where users can:

* Create posts
* View posts
* Delete posts

All frontend route calls are handled using **Wayfinder helpers**.

---

#  Features

* Laravel 12 Backend
* React Frontend using **Inertia.js**
* **Tailwind CSS** UI styling
* **Wayfinder** route helper integration
* Post CRUD system

  * Create Post
  * List Posts
  * Delete Post
* Clean project structure
* Example of **frontend → backend communication using Wayfinder**

---

#  Project Structure

```
PHP_Laravel12_Wayfinder
│
├── app
│   ├── Http
│   │   └── Controllers
│   │       └── PostController.php
│   └── Models
│       └── Post.php
│
├── resources
│   ├── js
│   │   ├── Pages
│   │   │   └── Posts
│   │   │       ├── Index.jsx
│   │   │       └── Create.jsx
│   │   │
│   │   └── actions
│   │       └── App/Http/Controllers/PostController.ts
│
├── routes
│   └── web.php
│
└── database
    └── migrations
```

---


# Step 1: Create Laravel Project

Open terminal and run:

```bash
composer create-project laravel/laravel PHP_Laravel12_Wayfinder
```

---

# Step 2: Configure Database

Open `.env` file and update database credentials.

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

---

# Step 3: Install Breeze (React + Inertia)

Install Breeze authentication scaffolding.

```bash
composer require laravel/breeze --dev
```

Install React stack.

```bash
php artisan breeze:install react
```

Install node dependencies.

```bash
npm install
```

Run migrations.

```bash
php artisan migrate
```

Run project.

```bash
php artisan serve
npm run dev
```

---

# Step 4: Install Wayfinder

Install Wayfinder package.

```bash
composer require laravel/wayfinder
```

Generate Wayfinder helpers.

```bash
php artisan wayfinder:generate
```

This will create:

```
resources/js/actions
```

Wayfinder automatically generates **route helper functions**.

---

# Step 5: Create Post Model and Migration

Create model with migration.

```bash
php artisan make:model Post -m
```

---

# Step 6: Migration

Open migration file and update table structure.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

Run migration:

```bash
php artisan migrate
```

---

# Step 7: Post Model

`app/Models/Post.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'title',
        'content'
    ];
}
```

---

# Step 8: Create Controller

Create controller:

```bash
php artisan make:controller PostController
```

`app/Http/Controllers/PostController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    // Display all posts on the index page
    public function index()
    {
        return Inertia::render('Posts/Index', [
            'posts' => Post::latest()->get() 
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
        $request->validate([
            'title' => 'required',
            'content' => 'required'
        ]);

        Post::create($request->all());

        return redirect()->route('posts.index');
    }

    // Delete the selected post
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('posts.index');
    }
}
```

---

# Step 9: Routes

`routes/web.php`

```php
<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Dashboard route accessible only for authenticated and verified users
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Routes related to user profile management (edit, update, delete)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Redirect home URL to posts page
Route::get('/', function () {
    return redirect('/posts');
});

// Resource routes for Post CRUD operations (index, create, store, show, edit, update, destroy)
Route::resource('posts', PostController::class);

require __DIR__.'/auth.php';
```

---

# Step 10: Wayfinder Generated File

`resources/js/actions/App/Http/Controllers/PostController.ts`

```ts
export const index = () => ({
url: "/posts",
method: "get"
})

export const store = () => ({
url: "/posts",
method: "post"
})

export const destroy = (id) => ({
url: `/posts/${id}`,
method: "delete"
})
```

---

# Step 11: React Index Page

`resources/js/Pages/Posts/Index.jsx`

```jsx
import { router, Link } from '@inertiajs/react'
import { destroy } from '@/actions/App/Http/Controllers/PostController'

export default function Index({ posts }) {
    function deletePost(id){
        if(confirm("Delete post?")){
            router.delete(destroy(id))
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Posts</h1>

                    <Link
                        href="/posts/create"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Create Post
                    </Link>
                </div>

                <div className="space-y-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white shadow rounded-lg p-5">
                            <h2 className="text-lg font-semibold">{post.title}</h2>

                            <p className="text-gray-600 mt-2">{post.content}</p>

                            <button
                                onClick={()=>deletePost(post.id)}
                                className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
```

---

# Step 12: React Create Page

`resources/js/Pages/Posts/Create.jsx`

```jsx
import { useState } from "react"
import { router, Link } from "@inertiajs/react"
import { store } from "@/actions/App/Http/Controllers/PostController"

export default function Create(){
    const [title,setTitle] = useState("")
    const [content,setContent] = useState("")

    function submit(e){
        e.preventDefault()
        router.post(store(),{ title, content })
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Create Post</h1>

                    <form onSubmit={submit} className="space-y-5">
                        <input
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                            placeholder="Title"
                            value={title}
                            onChange={e=>setTitle(e.target.value)}
                        />

                        <textarea
                            rows="5"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                            placeholder="Content"
                            value={content}
                            onChange={e=>setContent(e.target.value)}
                        />

                        <div className="flex gap-3">
                            <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg">
                                Save Post
                            </button>

                            <Link
                                href="/posts"
                                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg"
                            >
                                Back
                            </Link>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}
```

---

# Step 13: Run Project

Start Laravel server.

```bash
php artisan serve
```

Start frontend build.

```bash
npm run dev
```

Open in browser:

```
http://127.0.0.1:8000/posts
```

---

## POST INDEX

<img width="927" height="234" alt="Screenshot 2026-03-05 125055" src="https://github.com/user-attachments/assets/bc9a61f1-ce3f-4562-b17f-6fbd87e5daca" />


---

## CREATE POST

<img width="576" height="352" alt="Screenshot 2026-03-05 125042" src="https://github.com/user-attachments/assets/9e74f306-ed84-438a-bfe0-cceeabf71d5e" />


---

# What is Wayfinder?

Wayfinder is a Laravel package that **automatically generates frontend route helpers** based on Laravel controllers and routes.

Normally, frontend code calls routes like this:

```js
router.post('/posts', data)
```

This approach has problems:

* URLs are hardcoded
* If route changes, frontend breaks
* No type safety

Wayfinder solves this by generating **route helper functions**.

Example:

```js
router.post(store(), data)
```

Here the `store()` function is **generated automatically from the Laravel controller**.

### Benefits of Wayfinder

* No hardcoded URLs
* Safer frontend-backend communication
* Cleaner code
* Easier refactoring

---

# Conclusion

This project demonstrates how to integrate **Laravel, React, Inertia, and Wayfinder** to build a simple CRUD application.

Wayfinder improves developer experience by allowing frontend code to interact with backend routes using **generated helper functions instead of manually writing URLs**.

The project can be extended further by adding:

* Edit and Update functionality
* Pagination
* Validation error display
* Layout components
* Dashboard UI

