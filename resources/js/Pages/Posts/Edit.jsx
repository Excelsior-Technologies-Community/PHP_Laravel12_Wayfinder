import { useState } from 'react';

import {
    Head,
    Link,
    router,
} from '@inertiajs/react';

import {
    update,
    index,
} from '@/actions/App/Http/Controllers/PostController';

export default function Edit({ post, errors }) {
    const [title, setTitle] = useState(
        post.title
    );

    const [content, setContent] = useState(
        post.content
    );

    const [featured, setFeatured] = useState(
        Boolean(post.featured)
    );

    const [processing, setProcessing] =
        useState(false);

    function submit(e) {
        e.preventDefault();

        setProcessing(true);

        router.put(
            update(post.id),
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
            <Head title={`Edit - ${post.title}`} />

            <div className="min-h-screen bg-gray-100 py-10">
                <div className="mx-auto max-w-3xl px-4">

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Edit Post
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Update your post.
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
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
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
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
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
                                    Featured Post
                                </span>
                            </label>

                            <div className="flex gap-3">

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Updating...'
                                        : 'Update Post'}
                                </button>

                                <Link
                                    href={index()}
                                    className="rounded-lg bg-gray-500 px-5 py-2.5 font-medium text-white"
                                >
                                    Cancel
                                </Link>

                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </>
    );
}