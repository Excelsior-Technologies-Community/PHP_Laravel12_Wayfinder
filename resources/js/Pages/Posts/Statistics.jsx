import {
    Head,
    Link,
} from '@inertiajs/react';

import {
    index,
} from '@/actions/App/Http/Controllers/PostController';

export default function Statistics({
    statistics,
    latestPost,
    longestPost,
}) {
    return (
        <>
            <Head title="Post Statistics" />

            <div className="min-h-screen bg-gray-100 py-10">
                <div className="mx-auto max-w-6xl px-4">

                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Post Statistics Dashboard
                            </h1>

                            <p className="mt-1 text-gray-500">
                                Overview of post activity and content
                                statistics.
                            </p>
                        </div>

                        <Link
                            href={index()}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-center font-medium text-white transition hover:bg-blue-700"
                        >
                            Back to Posts
                        </Link>

                    </div>

                    {/* Statistics Cards */}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="rounded-xl bg-white p-6 shadow">
                            <p className="text-sm font-medium text-gray-500">
                                Total Posts
                            </p>

                            <p className="mt-2 text-3xl font-bold text-blue-600">
                                {statistics.total}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <p className="text-sm font-medium text-gray-500">
                                Today's Posts
                            </p>

                            <p className="mt-2 text-3xl font-bold text-green-600">
                                {statistics.today}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <p className="text-sm font-medium text-gray-500">
                                This Week
                            </p>

                            <p className="mt-2 text-3xl font-bold text-purple-600">
                                {statistics.week}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <p className="text-sm font-medium text-gray-500">
                                This Month
                            </p>

                            <p className="mt-2 text-3xl font-bold text-orange-600">
                                {statistics.month}
                            </p>
                        </div>

                    </div>

                    {/* Content statistics */}
                    <div className="mt-6 grid gap-6 md:grid-cols-2">

                        <div className="rounded-xl bg-white p-6 shadow">

                            <h2 className="text-xl font-semibold text-gray-800">
                                Content Statistics
                            </h2>

                            <div className="mt-5 space-y-4">

                                <div className="flex items-center justify-between border-b pb-3">
                                    <span className="text-gray-500">
                                        Average Content Length
                                    </span>

                                    <span className="font-semibold text-gray-800">
                                        {statistics.averageContentLength} characters
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">
                                        Total Posts
                                    </span>

                                    <span className="font-semibold text-gray-800">
                                        {statistics.total}
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* Latest Post */}
                        <div className="rounded-xl bg-white p-6 shadow">

                            <h2 className="text-xl font-semibold text-gray-800">
                                Latest Post
                            </h2>

                            {latestPost ? (
                                <div className="mt-4">

                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {latestPost.title}
                                    </h3>

                                    <p className="mt-2 text-gray-600">
                                        {latestPost.content}
                                    </p>

                                    <p className="mt-3 text-xs text-gray-400">
                                        Created:{' '}
                                        {new Date(
                                            latestPost.created_at
                                        ).toLocaleString()}
                                    </p>

                                </div>
                            ) : (
                                <p className="mt-4 text-gray-500">
                                    No posts available.
                                </p>
                            )}

                        </div>

                    </div>

                    {/* Longest Post */}
                    <div className="mt-6 rounded-xl bg-white p-6 shadow">

                        <h2 className="text-xl font-semibold text-gray-800">
                            Longest Post
                        </h2>

                        {longestPost ? (
                            <div className="mt-4">

                                <h3 className="text-lg font-semibold text-gray-800">
                                    {longestPost.title}
                                </h3>

                                <p className="mt-2 text-gray-600">
                                    {longestPost.content}
                                </p>

                                <p className="mt-3 text-sm text-gray-500">
                                    Content length:{' '}
                                    {longestPost.content.length} characters
                                </p>

                            </div>
                        ) : (
                            <p className="mt-4 text-gray-500">
                                No posts available.
                            </p>
                        )}

                    </div>

                </div>
            </div>
        </>
    );
}
