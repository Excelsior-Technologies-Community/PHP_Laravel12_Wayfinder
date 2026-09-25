import { useEffect, useState } from 'react';

import {
    Head,
    Link,
    router,
    usePage,
} from '@inertiajs/react';

import {
    index,
    create,
    show,
    edit,
    destroy,
    statistics,
} from '@/actions/App/Http/Controllers/PostController';

export default function Index({ posts, filters }) {

    const { flash } = usePage().props;

    const [search, setSearch] = useState(
        filters?.search || ''
    );

    const [sort, setSort] = useState(
        filters?.sort || 'latest'
    );

    // Search when typing stops
    useEffect(() => {

        const timeout = setTimeout(() => {

            router.get(
                index({
                    query: {
                        search: search || undefined,
                        sort: sort !== 'latest'
                            ? sort
                            : undefined,
                    },
                }),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );

        }, 400);

        return () => clearTimeout(timeout);

    }, [search, sort]);

    function deletePost(id) {

        if (
            confirm(
                'Are you sure you want to delete this post?'
            )
        ) {
            router.delete(
                destroy(id),
                {
                    preserveScroll: true,
                }
            );
        }
    }

    function clearFilters() {

        setSearch('');
        setSort('latest');
    }

    return (
        <>
            <Head title="Posts" />

            <div className="min-h-screen bg-gray-100 py-10">

                <div className="mx-auto max-w-6xl px-4">

                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>

                            <h1 className="text-3xl font-bold text-gray-800">
                                Posts
                            </h1>

                            <p className="mt-1 text-gray-500">
                                Manage your posts using Laravel,
                                React, Inertia and Wayfinder.
                            </p>

                        </div>

                        <div className="flex flex-wrap gap-2">

                            <Link
                                href={statistics()}
                                className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition hover:bg-purple-700"
                            >
                                Statistics
                            </Link>

                            <Link
                                href={create()}
                                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                            >
                                + Create Post
                            </Link>

                        </div>

                    </div>

                    {/* Success Message */}
                    {flash?.success && (
                        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {/* Search and Filters */}
                    <div className="mb-6 rounded-xl bg-white p-5 shadow">

                        <div className="grid gap-4 md:grid-cols-3">

                            <div className="md:col-span-2">

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Search Posts
                                </label>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search by title or content..."
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Sort By
                                </label>

                                <select
                                    value={sort}
                                    onChange={(e) =>
                                        setSort(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                >
                                    <option value="latest">
                                        Latest
                                    </option>

                                    <option value="oldest">
                                        Oldest
                                    </option>

                                    <option value="title_asc">
                                        Title A-Z
                                    </option>

                                    <option value="title_desc">
                                        Title Z-A
                                    </option>

                                </select>

                            </div>

                        </div>

                        <div className="mt-4 flex items-center justify-between">

                            <p className="text-sm text-gray-500">
                                Showing {posts.from || 0}-
                                {posts.to || 0} of {posts.total} posts
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                            >
                                Clear Filters
                            </button>

                        </div>

                    </div>

                    {/* Posts */}
                    {posts.data.length === 0 ? (

                        <div className="rounded-xl bg-white p-10 text-center shadow">

                            <h2 className="text-xl font-semibold text-gray-700">
                                No posts found
                            </h2>

                            <p className="mt-2 text-gray-500">
                                Try another search term or create
                                a new post.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {posts.data.map((post) => (

                                <div
                                    key={post.id}
                                    className="rounded-xl bg-white p-6 shadow transition hover:shadow-md"
                                >

                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                                        <div className="flex-1">

                                            <h2 className="text-xl font-semibold text-gray-800">
                                                {post.title}
                                            </h2>

                                            <p className="mt-2 text-gray-600">
                                                {post.content.length > 180
                                                    ? `${post.content.substring(0, 180)}...`
                                                    : post.content}
                                            </p>

                                            <p className="mt-3 text-xs text-gray-400">
                                                Created:{' '}
                                                {new Date(
                                                    post.created_at
                                                ).toLocaleString()}
                                            </p>

                                        </div>

                                        {/* Actions */}
                                        <div className="flex shrink-0 flex-wrap gap-2">

                                            {/* NEW: View */}
                                            <Link
                                                href={show(post.id)}
                                                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                                            >
                                                View
                                            </Link>

                                            {/* Edit */}
                                            <Link
                                                href={edit(post.id)}
                                                className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-600"
                                            >
                                                Edit
                                            </Link>

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deletePost(post.id)
                                                }
                                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                    {/* Pagination */}
                    {posts.links &&
                        posts.links.length > 3 && (

                            <div className="mt-8 flex flex-wrap justify-center gap-2">

                                {posts.links.map(
                                    (link, index) => {

                                        const label =
                                            link.label
                                                .replace(
                                                    '&laquo;',
                                                    '«'
                                                )
                                                .replace(
                                                    '&raquo;',
                                                    '»'
                                                );

                                        return (
                                            <Link
                                                key={index}
                                                href={
                                                    link.url ||
                                                    '#'
                                                }
                                                preserveState
                                                preserveScroll
                                                className={`rounded-lg px-4 py-2 text-sm ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : link.url
                                                            ? 'bg-white text-gray-700 shadow hover:bg-gray-100'
                                                            : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                                }`}
                                            >
                                                {label}
                                            </Link>
                                        );
                                    }
                                )}

                            </div>

                        )}

                </div>

            </div>
        </>
    );
}