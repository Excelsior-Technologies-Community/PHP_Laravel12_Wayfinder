import { useState } from 'react';

import {
    Head,
    Link,
    router,
} from '@inertiajs/react';

import {
    store,
    index,
} from '@/actions/App/Http/Controllers/PostController';

export default function Create({ errors }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [featured, setFeatured] = useState(false);
    const [processing, setProcessing] = useState(false);

    function submit(e) {
        e.preventDefault();

        setProcessing(true);

        router.post(
            store(),
            {
                title,
                content,
                featured,
            },
            {
                onFinish: () =>
                    setProcessing(false),
            }
        );
    }

    return (
        <>
            <Head title="Create Post" />

            <div className="min-h-screen bg-gray-100 py-10">
                <div className="mx-auto max-w-3xl px-4">

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Create Post
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Create a new post.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">

                        <form
                            onSubmit={submit}
                            className="space-y-5"
                        >

                            <div>
                                <label className="mb-2 block font-medium text-gray-700">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="Enter post title"
                                />

                                {errors?.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block font-medium text-gray-700">
                                    Content
                                </label>

                                <textarea
                                    rows="8"
                                    value={content}
                                    onChange={(e) =>
                                        setContent(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="Enter post content"
                                />

                                {errors?.content && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.content}
                                    </p>
                                )}
                            </div>

                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={featured}
                                    onChange={(e) =>
                                        setFeatured(
                                            e.target.checked
                                        )
                                    }
                                    className="h-5 w-5 rounded border-gray-300"
                                />

                                <span className="font-medium text-gray-700">
                                    Mark as Featured Post
                                </span>
                            </label>

                            <div className="flex gap-3">

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Saving...'
                                        : 'Save Post'}
                                </button>

                                <Link
                                    href={index()}
                                    className="rounded-lg bg-gray-500 px-5 py-2.5 font-medium text-white hover:bg-gray-600"
                                >
                                    Back
                                </Link>

                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </>
    );
}