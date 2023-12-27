import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchPost } from './actions';
import ThreadsContainer from '@/components/containers/ThreadsContainer';

export const metadata: Metadata = {
  title: 'Home | Threads',
  manifest: '/manifest.json',
};

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user?.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const { posts, isNext } = await fetchPost({ page: 1, limit: 10 });

  const threadData = {
    userId: user.id,
    userInfoId: userInfo._id,
    initialPosts: posts,
    isNext,
    isUser: false,
  };

  return (
    <>
      <h2 className='head-text text-left'>Home</h2>
      <section className='mt-6 flex flex-col gap-8'>
        <ThreadsContainer threadData={threadData} />
      </section>
    </>
  );
}
