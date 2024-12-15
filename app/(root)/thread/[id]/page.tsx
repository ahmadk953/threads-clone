import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import Comment from '@/components/forms/Comment';
import ThreadCard from '@/components/cards/ThreadCard';
import { fetchUser } from '@/lib/actions/user.actions';
import { getThreadById } from '@/lib/actions/thread.actions';

export const revalidate = 0;

async function page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');
  const thread = await getThreadById(params.id);

  return (
    <section className='relative'>
      <div>
        <ThreadCard
          id={thread._id}
          currentUserId={user.id}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          likes={thread.likes}
          userId={userInfo._id}
        />
      </div>
      <div className='mt-7'>
        <Comment
          threadId={params.id}
          currentUserImg={userInfo?.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className='mt-10'>
        {!thread.children || thread.children.length === 0 ? (
          <p className='no-result'>
            No Comments Yet. Be the First One to Comment on This Post!
          </p>
        ) : (
          thread.children
            .reverse()
            .map((childItem: any) => (
              <ThreadCard
                key={childItem._id}
                id={childItem._id}
                currentUserId={user.id}
                parentId={childItem.parentId}
                content={childItem.text}
                author={childItem.author}
                community={childItem.community}
                createdAt={childItem.createdAt}
                comments={childItem.children}
                likes={childItem.likes}
                userId={userInfo._id}
                isComment
              />
            ))
        )}
      </div>
    </section>
  );
}

export default page;
