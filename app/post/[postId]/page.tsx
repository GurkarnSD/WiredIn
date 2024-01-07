import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route"
import Navbar from '@/components/Navbar';
import { getPostPrisma } from '@/lib/prisma/posts';
import Post from '@/components/Post';
import { PostComment, UserPost, UserSession } from "@/types";

export const revalidate = 0;

const fetchPost = async (postId: string) => {
    const res = await getPostPrisma(postId)
    return res;
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
    const postId = params.postId;

    const session = (await getServerSession(authOptions)) as UserSession;
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
