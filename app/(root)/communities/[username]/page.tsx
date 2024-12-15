import Image from 'next/image';
import { currentUser } from '@clerk/nextjs/server';

import { communityTabs } from '@/constants';

import UserCard from '@/components/cards/UserCard';
import ThreadsContainer from '@/components/containers/ThreadsContainer';
import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { fetchCommunityDetails } from '@/lib/actions/community.actions';
import { fetchThreadsByCommunityId } from '@/lib/actions/thread.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

async function Page(props: Readonly<{ params: { username: string } }>) {
  const params = await props.params;
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const communityDetails = await fetchCommunityDetails(null, params.username);
  const { threads: posts, isNext } = await fetchThreadsByCommunityId(
    communityDetails._id,
    10,
    1
  );

  const threadData = {
    userId: user.id,
    userInfoId: userInfo._id,
    communityId: communityDetails._id,
    initialPosts: posts,
    isNext,
    isUser: false,
  };

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails.createdBy.id}
        authUserId={user.id}
        communityId={communityDetails.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        type='Community'
      />

      <div className='mt-9'>
        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {communityTabs.map((tab) => (
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
                    {communityDetails.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='threads' className='w-full text-light-1'>
            <section className='mt-9 flex flex-col gap-10'>
              <ThreadsContainer threadData={threadData} />
            </section>
          </TabsContent>

          <TabsContent value='members' className='mt-9 w-full text-light-1'>
            <section className='mt-9 flex flex-col gap-10'>
              {communityDetails.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  imgUrl={member.image}
                  personType='User'
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value='requests' className='w-full text-light-1'>
            <p className='no-result my-6'> Work-In-Progress </p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
