'use client';
import { useEffect, useRef, useState } from 'react';
import { PiShareFatFill } from 'react-icons/pi';
import Modal from '../ui/modal';
import Image from 'next/image';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
type Props = {
  postId: string;
  postContent: string;
  postTags: string[];
};

const ShareModal = ({ postId, postContent, postTags }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer = setTimeout(() => setIsCopied(false), 3000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsCopied(false);
  };

  const handleCopyBtn = async () => {
    if (inputRef.current) {
      try {
        inputRef.current.select();
        await navigator.clipboard.writeText(inputRef.current.value);
        setIsCopied(true);
      } catch (error) {
        console.error('Failed to copy text to clipboard:', error);
      }
    }
  };

  const tagsString = postTags.map((tag: string) => `#${tag}`).join(' ');
  const postURL = `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/thread/${postId}`;

  const shareData = {
    url: postURL,
    hashtag: tagsString,
    title: postContent,
  };

  return (
    <div>
      <button onClick={handleModalOpen}>
        {' '}
        <PiShareFatFill className='text-base-regular text-gray-1' />
      </button>

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <Modal.Content className='flex w-[300px] flex-col gap-6 p-6 md:w-[600px]'>
          <h1 className='text-xl font-medium text-light-1'>Share the post</h1>

          <div className='flex items-center gap-4 overflow-auto'>
            <FacebookShareButton {...shareData} title='Facebook'>
              <Image
                src='/assets/facebook-logo.png'
                height={40}
                width={40}
                alt='facebook'
              />
            </FacebookShareButton>
            <TwitterShareButton {...shareData} title='Twitter'>
              <Image
                src='/assets/twitter-logo.png'
                height={40}
                width={40}
                alt='Twitter'
              />
            </TwitterShareButton>
            <LinkedinShareButton {...shareData} title='LinkedIn'>
              <Image
                src='/assets/linkedin-logo.png'
                height={40}
                width={40}
                alt='LinkedIn'
              />
            </LinkedinShareButton>
            <PinterestShareButton {...shareData} media='' title='Pinterest'>
              <Image
                src='/assets/pinterest-log.png'
                height={40}
                width={40}
                alt='Pinterest'
              />
            </PinterestShareButton>
            <WhatsappShareButton {...shareData} title='Whatsapp'>
              <Image
                src='/assets/whatsapp-logo.png'
                height={40}
                width={40}
                alt='Whatsapp'
              />
            </WhatsappShareButton>
            <EmailShareButton {...shareData} title='Mail'>
              <Image
                src='/assets/mail-logo.png'
                height={40}
                width={40}
                alt='Mail'
              />
            </EmailShareButton>
            <TelegramShareButton {...shareData} title='Telegram'>
              <Image
                src='/assets/telegram-logo.png'
                height={40}
                width={40}
                alt='Telegram'
              />
            </TelegramShareButton>
            <TumblrShareButton {...shareData} title='Tumblr'>
              <Image
                src='/assets/tumblr-logo.png'
                height={40}
                width={40}
                alt='Tumblr'
              />
            </TumblrShareButton>
          </div>
          <div className='relative w-full overflow-hidden'>
            <Input
              readOnly
              ref={inputRef}
              value={postURL}
              className='account-form_input no-focus px-6 py-8'
            />
            <div className='absolute bottom-1 right-1 top-1 flex items-center justify-center bg-dark-3 py-2 pl-4 pr-2'>
              <Button
                onClick={handleCopyBtn}
                className='rounded-md bg-primary-500 px-8 py-2 !text-small-regular text-light-1 hover:bg-primary-500 max-xs:w-full'
              >
                {isCopied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        </Modal.Content>
      </Modal>
    </div>
  );
};
export default ShareModal;
