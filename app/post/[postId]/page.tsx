import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route"
import Navbar from '@/components/Navbar';
import { getPostPrisma } from '@/lib/prisma/posts';
import Post from '@/components/Post';
import { PostComment, UserPost, UserSession } from "@/types";
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next';
import { getUserPresignedUrl } from "@/lib/aws/image";

export async function generateMetadata(
    { params }: { params: { postId: string } },
): Promise<Metadata> {
    const postId = params.postId
    const postData = await fetchPost(postId) as unknown as PostWithStats;

    return {
        title: `${postData.user.displayName} on WiredIn ${postData.text ? ": " + "\"" + postData.text + "\"" : ""}`
    }
}

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

    let session = (await getServerSession(authOptions)) as UserSession;
    if (!session) redirect('/');
    const profilePic = (await getUserPresignedUrl(session?.user?.profilePic)).url as string;
    session = { ...session, user: { ...session?.user, profilePic } };
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
