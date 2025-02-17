import Image from 'next/image';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { profileTabs } from '@/constants';

import ThreadsContainer from '@/components/containers/ThreadsContainer';
import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { fetchUser } from '@/lib/actions/user.actions';
import { fetchThreadByUserId } from '@/lib/actions/thread.actions';

async function Page(props: Readonly<{ params: { id: string } }>) {
  const params = await props.params;
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect('/onboarding');
  const { threads: posts, isNext } = await fetchThreadByUserId(
    userInfo._id || '',
    10,
    1
  );

  type Post = (typeof posts)[0];
  const threadData = {
    userId: user.id,
    userInfoId: userInfo._id,
    initialPosts: posts,
    isNext,
    isUser: true,
  };

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className='mt-9'>
        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === 'Threads' && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userInfo.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-light-1'
            >
              {/* @ts-ignore */}
              <section className='mt-9 flex flex-col gap-10'>
                <ThreadsContainer threadData={threadData} />
              </section>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
export default Page;
