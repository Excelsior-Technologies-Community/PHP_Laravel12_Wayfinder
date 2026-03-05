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