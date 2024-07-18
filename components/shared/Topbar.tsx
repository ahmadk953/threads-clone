'use client';

import {
  OrganizationSwitcher,
  SignedIn,
  SignOutButton,
  UserButton,
} from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Image from 'next/image';
import Link from 'next/link';

function Topbar() {
  return (
    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-4'>
        <Image src='/assets/logo.svg' alt='logo' width={28} height={28} />
        <p className='text-heading3-bold text-light-1 max-xs:hidden'>Threads</p>
      </Link>

      <div className='flex items-center gap-1'>
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: 'py-2 px-4',
            },
          }}
        />

        <div className='ml-1'>
          <UserButton />
        </div>
      </div>
    </nav>
  );
}

export default Topbar;
