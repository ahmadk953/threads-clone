'use client';
import { likeToThread } from '@/lib/actions/thread.actions';
import millify from 'millify';
import { usePathname } from 'next/navigation';
import React, { useEffect, useLayoutEffect, useState } from 'react';

type Props = {
  likeCount: string[];
  threadId: string;
  userId: string;
};

const Like = ({ likeCount, threadId, userId }: Props) => {
  const [likes, setLikes] = useState<string[]>(likeCount);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [beforeLike, setBeforeLiked] = useState<boolean | null>(null);

  const pathname = usePathname();
  useLayoutEffect(() => {
    const alreadyLiked = likeCount.indexOf(userId);
    if (alreadyLiked !== -1 && !isLiked) {
      setBeforeLiked(true);
    } else {
      setBeforeLiked(false);
    }
    return undefined;
  }, []);

  const handleLikeBtn = async () => {
    try {
      if (likes.includes(userId)) {
        setBeforeLiked(false);
        // Unlike
        const newLikes = likes.filter((like) => like !== userId);
        setLikes(newLikes);
        setIsLiked(false);
      } else {
        // Like
        const newLikes = [...likes, userId];
        setLikes(newLikes);
        setIsLiked(true);
      }

      // Store the like status in the database
      await likeToThread(threadId, userId, pathname);
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  return (
    <div className='flex items-center gap-3 text-gray-1 duration-200 ease-in-out hover:text-[red]'>
      <div title={isLiked ? 'Unlike' : 'Like'} className='like-parent'>
        <div className='heart-container'>
          <button
            className={`heart-icon ${!beforeLike && isLiked ? 'liked' : ''} ${
              beforeLike && !isLiked ? 'already-like' : ''
            }`}
            onClick={handleLikeBtn}
            onKeyDown={handleLikeBtn}
          ></button>
        </div>
      </div>
      <div
        className={`h-4 overflow-hidden ${beforeLike ? 'text-[#E2264D]' : ''}`}
      >
        <p
          className={`likes-number-before my-0 py-0 text-subtle-medium ${
            isLiked ? 'slide-up text-[#E2264D]' : ''
          }`}
        >
          {millify(likes.length)}
        </p>
        <p
          className={`likes-number-after my-0 py-0 text-subtle-medium ${
            isLiked ? 'slide-down text-[#E2264D]' : ''
          }`}
        >
          {millify(likes.length)}
        </p>
      </div>
    </div>
  );
};

export default Like;
