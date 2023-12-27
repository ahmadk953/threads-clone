'use client';
import { getThreads } from '@/lib/actions/thread.actions';
import { fetchThreadByUserId } from '@/lib/actions/thread.actions';
import { fetchThreadsByCommunityId } from '@/lib/actions/thread.actions';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import ThreadCard, { Author, Community } from '@/components/cards/ThreadCard';
import ThreadSkeleton from '@/components/skeletons/ThreadSkeleton';

type Post = {
  _id: string;
  text: string;
  author: Author;
  community: Community;
  createdAt: string;
  children: any[];
  likes: any[];
  parentId: string;
};

type Props = {
  threadData: {
    initialPosts: Post[];
    isNext: boolean;
    userId: string;
    userInfoId: string;
    isUser: boolean;
    communityId?: string;
  };
};

const ThreadsContainer = ({ threadData }: Props) => {
  const [posts, setPosts] = useState<Post[]>(threadData.initialPosts);
  const [page, setPage] = useState<number>(1);
  const [ref, inView] = useInView();
  const [isNext, setIsNext] = useState<boolean>(threadData.isNext);

  async function fetchMorePosts() {
    const next = page + 1;

    let { threads: newPosts, isNext: newIsNext } = await getThreads(next, 10);

    if (threadData.isUser) {
      ({ threads: newPosts, isNext: newIsNext } = await fetchThreadByUserId(
        threadData.userInfoId || '',
        10,
        next
      ));
    } else if (threadData.communityId) {
      ({ threads: newPosts, isNext: newIsNext } =
        await fetchThreadsByCommunityId(threadData.communityId, next, 10));
    }

    if (newPosts?.length) {
      setPosts((prev: any) => [...prev, ...newPosts]);
      setPage(page + 1);
      setIsNext(newIsNext);
    } else {
      setIsNext(false);
    }
  }
  useEffect(() => {
    if (inView && isNext) {
      fetchMorePosts();
    }
  }, [inView]);

  return (
    <>
      {posts?.length ? (
        <>
          {posts?.map((post: Post, index: number) => {
            const data = {
              id: post?._id,
              currentUserId: threadData.userId,
              parentId: post.parentId,
              content: post.text,
              author: post.author,
              community: post.community,
              createdAt: post.createdAt,
              comments: post.children,
              userId: threadData.userInfoId,
              likes: post.likes,
            };
            return <ThreadCard key={index} {...data} />;
          })}
        </>
      ) : (
        <p className='no-result'>No Post Found</p>
      )}

      <div className='flex flex-col gap-8' ref={ref}>
        {isNext ? (
          <>
            <ThreadSkeleton />
            <div className='hidden lg:block'>
              <ThreadSkeleton />
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default ThreadsContainer;
