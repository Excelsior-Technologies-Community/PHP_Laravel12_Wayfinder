import {
    Head,
    Link,
} from '@inertiajs/react';

import {
    index,
    create,
} from '@/actions/App/Http/Controllers/PostController';

export default function Statistics({
    statistics,
    latestPost,
    longestPost,
    topLongestPosts,
    recentPosts,
}) {
    return (
        <>
            <Head title="Post Statistics" />

            <div className="min-h-screen bg-gray-100 py-10">

                <div className="mx-auto max-w-7xl px-4">

                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>

                            <h1 className="text-3xl font-bold text-gray-800">
                                Post Statistics Dashboard
                            </h1>

                            <p className="mt-1 text-gray-500">
                                Complete overview of post activity.
                            </p>

                        </div>

                        <div className="flex gap-2">

                            <Link
                                href={index()}
                                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
                            >
                                All Posts
                            </Link>

                            <Link
                                href={create()}
                                className="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700"
                            >
                                Create Post
                            </Link>

                        </div>

                    </div>

                    {/* Main Cards */}

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

                        <div className="rounded-xl bg-white p-6 shadow">
                            <p className="text-sm text-gray-500">
                                Total Posts
                            </p>

                            <p className="mt-2 text-3xl font-bold text-blue-600">
                                {statistics.total}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <p className="text-sm text-gray-500">
                                Today
                            </p>

                            <p className="mt-2 text-3xl font-bold text-green-600">
                                {statistics.today}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <p className="text-sm text-gray-500">
                                This Week
                            </p>

                            <p className="mt-2 text-3xl font-bold text-purple-600">
                                {statistics.week}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <p className="text-sm text-gray-500">
                                This Month
                            </p>

                            <p className="mt-2 text-3xl font-bold text-orange-600">
                                {statistics.month}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <p className="text-sm text-gray-500">
                                Featured
                            </p>

                            <p className="mt-2 text-3xl font-bold text-yellow-600">
                                {statistics.featured}
                            </p>
                        </div>

                    </div>

                    {/* Content Statistics */}

                    <div className="mt-6 grid gap-6 md:grid-cols-2">

                        <div className="rounded-xl bg-white p-6 shadow">

                            <h2 className="text-xl font-semibold text-gray-800">
                                Content Statistics
                            </h2>

                            <div className="mt-5 space-y-4">

                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-gray-500">
                                        Average Content Length
                                    </span>

                                    <span className="font-semibold">
                                        {statistics.averageContentLength}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-gray-500">
                                        Average Word Count
                                    </span>

                                    <span className="font-semibold">
                                        {statistics.averageWordCount}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Featured Posts
                                    </span>

                                    <span className="font-semibold">
                                        {statistics.featured}
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* Latest */}

                        <div className="rounded-xl bg-white p-6 shadow">

                            <h2 className="text-xl font-semibold text-gray-800">
                                Latest Post
                            </h2>

                            {latestPost ? (
                                <div className="mt-4">

                                    <h3 className="text-lg font-semibold">
                                        {latestPost.title}
                                    </h3>

                                    <p className="mt-2 text-gray-600">
                                        {latestPost.content}
                                    </p>

                                    <p className="mt-3 text-xs text-gray-400">
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

                    {/* Top Longest Posts */}

                    <div className="mt-6 rounded-xl bg-white p-6 shadow">

                        <h2 className="text-xl font-semibold text-gray-800">
                            Top 5 Longest Posts
                        </h2>

                        <div className="mt-5 overflow-x-auto">

                            <table className="w-full text-left">

                                <thead>
                                    <tr className="border-b text-sm text-gray-500">
                                        <th className="px-3 py-3">
                                            #
                                        </th>

                                        <th className="px-3 py-3">
                                            Title
                                        </th>

                                        <th className="px-3 py-3">
                                            Words
                                        </th>

                                        <th className="px-3 py-3">
                                            Characters
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {topLongestPosts?.map(
                                        (
                                            post,
                                            postIndex
                                        ) => (

                                            <tr
                                                key={
                                                    post.id
                                                }
                                                className="border-b"
                                            >

                                                <td className="px-3 py-3 font-semibold">
                                                    {postIndex + 1}
                                                </td>

                                                <td className="px-3 py-3">
                                                    {post.title}
                                                </td>

                                                <td className="px-3 py-3">
                                                    {post.word_count ??
                                                        0}
                                                </td>

                                                <td className="px-3 py-3">
                                                    {post.content.length}
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* Recent Activity */}

                    <div className="mt-6 rounded-xl bg-white p-6 shadow">

                        <h2 className="text-xl font-semibold text-gray-800">
                            Recent Posts Activity
                        </h2>

                        <div className="mt-5 space-y-3">

                            {recentPosts?.map(
                                (post) => (

                                    <div
                                        key={
                                            post.id
                                        }
                                        className="flex flex-col gap-2 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >

                                        <div>

                                            <p className="font-semibold text-gray-800">
                                                {post.title}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {post.word_count ??
                                                    0}{' '}
                                                words
                                            </p>

                                        </div>

                                        <p className="text-sm text-gray-400">
                                            {new Date(
                                                post.created_at
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                    {/* Longest */}

                    {longestPost && (
                        <div className="mt-6 rounded-xl bg-white p-6 shadow">

                            <h2 className="text-xl font-semibold text-gray-800">
                                Longest Post
                            </h2>

                            <h3 className="mt-4 text-lg font-semibold">
                                {longestPost.title}
                            </h3>

                            <p className="mt-2 text-gray-600">
                                {longestPost.content}
                            </p>

                            <p className="mt-3 text-sm text-gray-500">
                                {longestPost.content.length}{' '}
                                characters
                            </p>

                        </div>
                    )}

                </div>

            </div>
        </>
    );
}