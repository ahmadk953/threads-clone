import Image from 'next/image';
import Link from 'next/link';
import { FaComment } from 'react-icons/fa';
import { formatDateString } from '@/lib/utils';
import DeleteThread from '../forms/DeleteThread';
import Like from '../shared/Like';
import millify from 'millify';
import ShareModal from '../shared/ShareModal';

export type Author = {
  name: string;
  image: string;
  id: string;
};
export type Community = {
  id: string;
  name: string;
  image: string;
} | null;

type Comment = {
  author: {
    image: string;
  };
};

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: Author;
  community: Community;
  createdAt: string;
  comments: Comment[];
  isComment?: boolean;
  userId?: string;
  likes?: string[];
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  userId,
  content,
  author,
  community,
  createdAt,
  comments,
  likes = [],
  isComment = false,
}: Props) => {
  function getRandomLikeCount(min: number, max: number): number {
    const range = max - min;
    const randomValue = Math.random();
    const randomNumber = min + Math.floor(randomValue * range);
    return randomNumber;
  }

  // Regular expression to match hashtags
  const hashtagRegex = /#(\w+)/g;

  // Array to store extracted hashtags
  const hashtags: string[] = [];

  // String to store plain text
  let plainText: string = '';

  let match;
  let lastIndex = 0;
  while ((match = hashtagRegex.exec(content)) !== null) {
    const hashtag = match[1];
    hashtags.push(hashtag);
    plainText += content.slice(lastIndex, match.index);
    lastIndex = hashtagRegex.lastIndex;
  }

  plainText += content.slice(lastIndex);

  const likeData = {
    threadId: id,
    userId: userId || '',
    likeCount: likes || [],
  };

  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'
      }`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link
              href={`/profile/${author.id}`}
              className='relative h-8 w-8 md:h-11 md:w-11'
            >
              <Image
                src={author.image}
                alt='user_community_image'
                fill
                className='cursor-pointer rounded-full'
              />
            </Link>

            <div className='thread-card_bar' />
          </div>

          <div className='flex w-full flex-col'>
            <Link href={`/profile/${author.id}`} className='w-fit'>
              <h4 className='cursor-pointer text-base-semibold text-light-1'>
                {author.name}
              </h4>
            </Link>

            <p className='mt-2 text-small-regular text-light-2'>{plainText}</p>
            <div className='flex flex-wrap gap-x-1'>
              {hashtags.length
                ? hashtags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className='text-small-regular text-primary-500'
                    >
                      #{tag}
                    </span>
                  ))
                : null}
            </div>

            <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
              <div className='flex items-center  gap-2 md:gap-3.5'>
                {/* Like Component  */}
                <Like {...likeData} />
                <Link
                  title='Comment'
                  href={`/thread/${id}`}
                  className='flex items-center gap-1'
                >
                  <FaComment className='text-base-regular text-gray-1' />
                  {comments.length ? (
                    <p className='text-subtle-medium text-gray-1'>
                      {comments.length}
                    </p>
                  ) : null}
                </Link>
                <ShareModal
                  postId={id}
                  postContent={content}
                  postTags={hashtags}
                />
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className='mt-1 text-subtle-medium text-gray-1'>
                    {millify(comments.length)} repl
                    {comments.length > 1 ? 'ies' : 'y'}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        <DeleteThread
          threadId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>

      {!isComment && comments.length > 0 && (
        <div className='ml-1 mt-3 flex items-center gap-2'>
          {comments.slice(0, 2).map((comment, index) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && '-ml-5'} rounded-full object-cover`}
            />
          ))}

          <Link href={`/thread/${id}`}>
            <p className='mt-1 text-subtle-medium text-gray-1'>
              {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
            </p>
          </Link>
        </div>
      )}

      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className='mt-5 flex items-center'
        >
          <p className='text-subtle-medium text-gray-1'>
            {formatDateString(createdAt)}
            {community && ` - ${community.name} Community`}
          </p>

          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className='object-fit ml-1 rounded-full'
          />
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;
