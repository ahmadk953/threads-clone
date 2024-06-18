import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import React, { Fragment, HTMLAttributes, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

export type ModalProps = {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
} & HTMLAttributes<HTMLDivElement>;

const Modal = ({ children, className, isOpen, onClose }: ModalProps) => {
  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-50 overflow-auto'
          onClose={handleOnClose}
        >
          <div
            className={twMerge(
              'flex min-h-screen justify-center px-4 py-10 text-center'
            )}
          >
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-dark-1 bg-opacity-50 dark:bg-opacity-75' />
            </TransitionChild>

            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel
                className={twMerge(
                  'group relative flex transform flex-col self-center rounded-md bg-dark-2 text-left text-light-1 shadow-xl transition-all',

                  className
                )}
              >
                {children}
                <button
                  type='button'
                  onClick={onClose}
                  className='rounded-primary text-sm absolute right-2 top-2 p-2 text-gray-1 outline-none transition-colors duration-150 hover:text-slate-700 focus:outline-none dark:text-slate-400 dark:hover:text-slate-300'
                >
                  &#10005;
                </button>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export type ContentProps = {
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const Content: React.FunctionComponent<ContentProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div
      className={twMerge('flex-grow overflow-auto px-6 py-4', className)}
      {...rest}
    >
      {children}
    </div>
  );
};

Modal.Content = Content;
export default Modal;
