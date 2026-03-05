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