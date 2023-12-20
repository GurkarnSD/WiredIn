import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route"
import Navbar from '@/components/Navbar';
import { getPostPrisma } from '@/lib/prisma/posts';
import Post from '@/components/Post';

export const revalidate = 0;

const fetchPost = async (postId: string) => {
    const res = await getPostPrisma(postId)
    return res;
}

export default async function PostPage({ params }: { params: { postId: string } }) {
    const postId = params.postId;

    const session = await getServerSession(authOptions);
    const postData = await fetchPost(postId)

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Post post={postData} session={session} />
            </div>
        </>
    )
}
