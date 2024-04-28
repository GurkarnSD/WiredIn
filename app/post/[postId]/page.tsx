import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route"
import Navbar from '@/components/Navbar';
import { getPostPrisma } from '@/lib/prisma/posts';
import Post from '@/components/Post';
import { PostComment, UserPost, UserSession } from "@/types";
import { notFound, redirect } from 'next/navigation'

export const revalidate = 0;

const fetchPost = async (postId: string) => {
    try {
        const post = await getPostPrisma(postId)
        return post
    } catch (e) {
        notFound()
    }
}

type PostWithStats = UserPost & {
    likes: { uid: string }[];
    _count: {
        likes: number;
        comments: number;
    };
    comments: PostCommentWithStats[];
};

type PostCommentWithStats = PostComment & {
    likes: { uid: string }[];
    _count: {
        likes: number;
        responses: number;
    };
};

export default async function PostPage({ params }: { params: { postId: string } }) {

    const session = (await getServerSession(authOptions)) as UserSession;
    if (!session) redirect('/')
    const postId = params.postId;
    const postData = await fetchPost(postId) as unknown as PostWithStats;

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Post post={postData} user={session.user} />
            </div>
        </>
    )
}
