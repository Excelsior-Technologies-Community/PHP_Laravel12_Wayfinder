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
    duplicate,
    toggleFeatured,
} from '@/actions/App/Http/Controllers/PostController';

export default function Index({
    posts,
    filters,
}) {
    const { flash } = usePage().props;

    const [search, setSearch] =
        useState(filters?.search || '');

    const [sort, setSort] =
        useState(filters?.sort || 'latest');

    const [dateFrom, setDateFrom] =
        useState(filters?.date_from || '');

    const [dateTo, setDateTo] =
        useState(filters?.date_to || '');

    const [featured, setFeatured] =
        useState(filters?.featured === '1');

    const [perPage, setPerPage] =
        useState(filters?.per_page || 6);

    const [selectedIds, setSelectedIds] =
        useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                index({
                    query: {
                        search:
                            search || undefined,

                        sort:
                            sort !== 'latest'
                                ? sort
                                : undefined,

                        date_from:
                            dateFrom || undefined,

                        date_to:
                            dateTo || undefined,

                        featured:
                            featured
                                ? '1'
                                : undefined,

                        per_page:
                            perPage !== 6
                                ? perPage
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

        return () =>
            clearTimeout(timeout);
    }, [
        search,
        sort,
        dateFrom,
        dateTo,
        featured,
        perPage,
    ]);

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

    function duplicatePost(id) {
        router.post(
            duplicate(id),
            {},
            {
                preserveScroll: true,
            }
        );
    }

    function togglePostFeatured(id) {
        router.patch(
            toggleFeatured(id),
            {},
            {
                preserveScroll: true,
            }
        );
    }

    function toggleSelected(id) {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter(
                      (item) => item !== id
                  )
                : [...current, id]
        );
    }

    function toggleAll() {
        const ids = posts.data.map(
            (post) => post.id
        );

        if (
            ids.every((id) =>
                selectedIds.includes(id)
            )
        ) {
            setSelectedIds([]);
        } else {
            setSelectedIds(ids);
        }
    }

    function bulkDelete() {
        if (selectedIds.length === 0) {
            alert(
                'Please select at least one post.'
            );

            return;
        }

        if (
            confirm(
                `Delete ${selectedIds.length} selected post(s)?`
            )
        ) {
            router.post(
                '/posts/bulk-delete',
                {
                    ids: selectedIds,
                },
                {
                    preserveScroll: true,

                    onSuccess: () =>
                        setSelectedIds([]),
                }
            );
        }
    }

    function clearFilters() {
        setSearch('');
        setSort('latest');
        setDateFrom('');
        setDateTo('');
        setFeatured(false);
        setPerPage(6);
        setSelectedIds([]);
    }

    function exportCsv() {
        const params = new URLSearchParams();

        if (search) {
            params.append(
                'search',
                search
            );
        }

        if (dateFrom) {
            params.append(
                'date_from',
                dateFrom
            );
        }

        if (dateTo) {
            params.append(
                'date_to',
                dateTo
            );
        }

        window.location.href =
            '/posts-export?' +
            params.toString();
    }

    const allSelected =
        posts.data.length > 0 &&
        posts.data.every((post) =>
            selectedIds.includes(post.id)
        );

    return (
        <>
            <Head title="Posts" />

            <div className="min-h-screen bg-gray-100 py-10">

                <div className="mx-auto max-w-7xl px-4">

                    {/* Header */}

                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                All Posts
                            </h1>

                            <p className="mt-1 text-gray-500">
                                Manage posts with search,
                                filtering, bulk actions
                                and analytics.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">

                            <Link
                                href={statistics()}
                                className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
                            >
                                Statistics
                            </Link>

                            <button
                                type="button"
                                onClick={exportCsv}
                                className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                            >
                                Export CSV
                            </button>

                            <Link
                                href={create()}
                                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                            >
                                + Create Post
                            </Link>

                        </div>

                    </div>

                    {/* Flash */}

                    {flash?.success && (
                        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {/* Filters */}

                    <div className="mb-6 rounded-xl bg-white p-5 shadow">

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                            <div className="lg:col-span-2">

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Search
                                </label>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search title or content..."
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Sort
                                </label>

                                <select
                                    value={sort}
                                    onChange={(e) =>
                                        setSort(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
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

                                    <option value="longest">
                                        Longest
                                    </option>

                                    <option value="shortest">
                                        Shortest
                                    </option>
                                </select>

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Per Page
                                </label>

                                <select
                                    value={perPage}
                                    onChange={(e) =>
                                        setPerPage(
                                            Number(
                                                e.target.value
                                            )
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                                >
                                    <option value="6">
                                        6
                                    </option>

                                    <option value="12">
                                        12
                                    </option>

                                    <option value="24">
                                        24
                                    </option>

                                    <option value="48">
                                        48
                                    </option>
                                </select>

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    From Date
                                </label>

                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) =>
                                        setDateFrom(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    To Date
                                </label>

                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) =>
                                        setDateTo(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                                />

                            </div>

                            <div className="flex items-end">

                                <label className="flex cursor-pointer items-center gap-3">

                                    <input
                                        type="checkbox"
                                        checked={featured}
                                        onChange={(e) =>
                                            setFeatured(
                                                e.target.checked
                                            )
                                        }
                                        className="h-5 w-5 rounded"
                                    />

                                    <span className="font-medium text-gray-700">
                                        Featured Only
                                    </span>

                                </label>

                            </div>

                            <div className="flex items-end">

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-100"
                                >
                                    Clear Filters
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* Bulk Actions */}

                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow">

                        <label className="flex items-center gap-3">

                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleAll}
                                className="h-5 w-5 rounded"
                            />

                            <span className="font-medium text-gray-700">
                                Select All
                            </span>

                        </label>

                        <div className="flex items-center gap-3">

                            <span className="text-sm text-gray-500">
                                {selectedIds.length}{' '}
                                selected
                            </span>

                            <button
                                type="button"
                                onClick={bulkDelete}
                                disabled={
                                    selectedIds.length ===
                                    0
                                }
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Bulk Delete
                            </button>

                        </div>

                    </div>

                    {/* Result Count */}

                    <div className="mb-4 text-sm text-gray-500">
                        Showing{' '}
                        {posts.from || 0}
                        -
                        {posts.to || 0}
                        {' '}of{' '}
                        {posts.total}
                        {' '}posts
                    </div>

                    {/* Posts */}

                    {posts.data.length === 0 ? (

                        <div className="rounded-xl bg-white p-10 text-center shadow">

                            <h2 className="text-xl font-semibold text-gray-700">
                                No posts found
                            </h2>

                            <p className="mt-2 text-gray-500">
                                Try changing your filters.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {posts.data.map((post) => (

                                <div
                                    key={post.id}
                                    className="rounded-xl bg-white p-6 shadow transition hover:shadow-md"
                                >

                                    <div className="flex gap-4">

                                        <div className="pt-1">

                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(
                                                    post.id
                                                )}
                                                onChange={() =>
                                                    toggleSelected(
                                                        post.id
                                                    )
                                                }
                                                className="h-5 w-5 rounded"
                                            />

                                        </div>

                                        <div className="flex-1">

                                            <div className="flex flex-wrap items-center gap-2">

                                                <h2 className="text-xl font-semibold text-gray-800">
                                                    {post.title}
                                                </h2>

                                                {post.featured && (
                                                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                                        ⭐ Featured
                                                    </span>
                                                )}

                                            </div>

                                            <p className="mt-2 text-gray-600">
                                                {post.content.length > 180
                                                    ? `${post.content.substring(
                                                          0,
                                                          180
                                                      )}...`
                                                    : post.content}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">

                                                <span>
                                                    ID: #{post.id}
                                                </span>

                                                <span>
                                                    Words:{' '}
                                                    {post.word_count ??
                                                        0}
                                                </span>

                                                <span>
                                                    Reading:{' '}
                                                    {post.reading_time ??
                                                        0}{' '}
                                                    min
                                                </span>

                                                <span>
                                                    Created:{' '}
                                                    {new Date(
                                                        post.created_at
                                                    ).toLocaleString()}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="flex shrink-0 flex-wrap items-start justify-end gap-2">

                                            <Link
                                                href={show(post.id)}
                                                className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                                            >
                                                View
                                            </Link>

                                            <Link
                                                href={edit(post.id)}
                                                className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    duplicatePost(
                                                        post.id
                                                    )
                                                }
                                                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                            >
                                                Duplicate
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    togglePostFeatured(
                                                        post.id
                                                    )
                                                }
                                                className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600"
                                            >
                                                {post.featured
                                                    ? 'Unfeature'
                                                    : 'Feature'}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deletePost(
                                                        post.id
                                                    )
                                                }
                                                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
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
                                    (
                                        link,
                                        linkIndex
                                    ) => {

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
                                                key={
                                                    linkIndex
                                                }
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