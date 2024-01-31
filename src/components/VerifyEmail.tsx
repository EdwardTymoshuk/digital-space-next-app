'use client'

import { trpc } from '@/trpc/client'
import Image from 'next/image'
import Link from 'next/link'
import { MdErrorOutline } from "react-icons/md"
import { buttonVariants } from './ui/button'
import { BiLoaderAlt } from "react-icons/bi";

interface VerifyEmailProps {
  token: string
}

const VerifyEmail = ({ token }: VerifyEmailProps) => {
  const { data, isError, isLoading } = trpc.auth.verifyEmail.useQuery({
    token,
  })
  if (isError) {
    return (
      <div className='flex flex-col items-center gap-2'>
        <MdErrorOutline className='text-red-600 h-8 w-8' />
        <h3 className='text-xl font-semibold'>There was a problem</h3>
        <p className='text-muted-foreground text-sm'>This token is not valid or expired. Please try again.</p>
      </div>
    )
  }

  if (data?.success) {
    return (
      <div className='flex h-full flex-col items-center justify-center'>
        <div className='relative mb-4 h-60 w-60 text-muted-foreground'>
          <Image 
            src="/hippo-email-sent.png"
            fill
            alt='The email was sent' />
        </div>

      <h3 className='font-semibold text-2xl'>You&apos;re all set!</h3>
      <p className='text-muted-foreground text-center mt-1'>Thank you for verifying your email.</p>
      <Link className={buttonVariants({className: 'mt-4'})} href='/sign-in'>Sing in</Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='flex flex-col items-center gap-2'>
        <BiLoaderAlt className='animate-spin text-yellow-6 00 h-8 w-8' />
        <h3 className='text-xl font-semibold'>Verifying...</h3>
        <p className='text-muted-foreground text-sm'>This won&apos;t take long.</p>
      </div>
    )
  }
  
  return <></>

}

export default VerifyEmail
