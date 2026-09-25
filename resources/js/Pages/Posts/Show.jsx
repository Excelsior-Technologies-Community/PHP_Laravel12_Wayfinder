import {
    Head,
    Link,
} from '@inertiajs/react';

import {
    index,
    edit,
} from '@/actions/App/Http/Controllers/PostController';

export default function Show({ post }) {

    const characterCount = post.content
        ? post.content.length
        : 0;

    const wordCount = post.content
        ? post.content.trim().split(/\s+/).filter(Boolean).length
        : 0;

    const createdDate = new Date(post.created_at);

    const updatedDate = new Date(post.updated_at);

    const wasUpdated =
        post.updated_at !== post.created_at;

    return (
        <>
            <Head title={`View - ${post.title}`} />

            <div className="min-h-screen bg-gray-100 py-10">

                <div className="mx-auto max-w-4xl px-4">

                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="text-sm font-medium text-blue-600">
                                Post Details
                            </p>

                            <h1 className="mt-1 text-3xl font-bold text-gray-800">
                                {post.title}
                            </h1>
                        </div>

                        <div className="flex gap-2">

                            <Link
                                href={edit(post.id)}
                                className="rounded-lg bg-yellow-500 px-4 py-2 font-medium text-white transition hover:bg-yellow-600"
                            >
                                Edit Post
                            </Link>

                            <Link
                                href={index()}
                                className="rounded-lg bg-gray-500 px-4 py-2 font-medium text-white transition hover:bg-gray-600"
                            >
                                Back
                            </Link>

                        </div>

                    </div>

                    {/* Main Post */}
                    <div className="overflow-hidden rounded-xl bg-white shadow">

                        {/* Post Header */}
                        <div className="border-b border-gray-200 px-6 py-5">

                            <div className="flex flex-wrap items-center gap-3">

                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                    Post #{post.id}
                                </span>

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                                    {characterCount} characters
                                </span>

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                                    {wordCount} words
                                </span>

                            </div>

                        </div>

                        {/* Post Content */}
                        <div className="px-6 py-8">

                            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                                {post.title}
                            </h2>

                            <div className="whitespace-pre-line break-words leading-8 text-gray-700">
                                {post.content}
                            </div>

                        </div>

                        {/* Metadata */}
                        <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">

                            <h3 className="mb-4 text-lg font-semibold text-gray-800">
                                Post Information
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-2">

                                <div className="rounded-lg bg-white p-4 shadow-sm">

                                    <p className="text-sm text-gray-500">
                                        Post ID
                                    </p>

                                    <p className="mt-1 font-semibold text-gray-800">
                                        #{post.id}
                                    </p>

                                </div>

                                <div className="rounded-lg bg-white p-4 shadow-sm">

                                    <p className="text-sm text-gray-500">
                                        Content Length
                                    </p>

                                    <p className="mt-1 font-semibold text-gray-800">
                                        {characterCount} characters
                                    </p>

                                </div>

                                <div className="rounded-lg bg-white p-4 shadow-sm">

                                    <p className="text-sm text-gray-500">
                                        Created At
                                    </p>

                                    <p className="mt-1 font-semibold text-gray-800">
                                        {createdDate.toLocaleString()}
                                    </p>

                                </div>

                                <div className="rounded-lg bg-white p-4 shadow-sm">

                                    <p className="text-sm text-gray-500">
                                        Last Updated
                                    </p>

                                    <p className="mt-1 font-semibold text-gray-800">
                                        {updatedDate.toLocaleString()}
                                    </p>

                                </div>

                            </div>

                            {wasUpdated && (
                                <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                                    This post has been updated after it
                                    was originally created.
                                </div>
                            )}

                        </div>

                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-6 flex flex-wrap gap-3">

                        <Link
                            href={index()}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                        >
                            ← Back to All Posts
                        </Link>

                        <Link
                            href={edit(post.id)}
                            className="rounded-lg bg-yellow-500 px-5 py-2.5 font-medium text-white transition hover:bg-yellow-600"
                        >
                            Edit This Post
                        </Link>

                    </div>

                </div>

            </div>
        </>
    );
}