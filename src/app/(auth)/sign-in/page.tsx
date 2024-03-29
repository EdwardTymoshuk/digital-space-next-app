'use client'

import { Icons } from '@/components/Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { GoArrowRight } from 'react-icons/go'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthCredentialsValidator, TAuthCredentialsValidator } from '@/lib/validators/account-credentials-validator'
import { trpc } from '@/trpc/client'
import { toast } from 'sonner'
import { ZodError } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'

const Page = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const isSeller = searchParams.get('as') === 'seller'
	const origin = searchParams.get('origin')

	const continueAsBuyer = () => {
		router.replace('/sign-in', undefined)
	}
	const continueAsSeller = () => {
		router.push('?as=seller')
	}

	const { register, handleSubmit, formState: { errors } } = useForm<TAuthCredentialsValidator>({
		resolver: zodResolver(AuthCredentialsValidator),
	})

	const { mutate, isLoading } = trpc.auth.signIn.useMutation({
		onSuccess: () => {
			toast.success('Signed in successfully')
			router.refresh()
			if (origin) {
				router.push(`/${origin}`)
				return
			}
			if (isSeller) {
				router.push('/sell')
				return
			}
			router.push('/')
		},
		onError: (err) => {
			if (err.data?.code === 'UNAUTHORIZED') {
				toast.error('Invalid email or password')
			}
		}
	})

	const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
		mutate({ email, password })
	}

	return (
		<>
			<div className='container relative flex flex-col pt-20 items-center justify-center lg:px-0'>
				<div className='flex flex-col mx-auto w-full justify-center space-y-6 sm:w-[350px]'>
					<div className='flex flex-col items-center space-y-2 text-center'>
						<Icons.logo className='h-20 w-20' />
						<h1 className='text-2xl font-bold'>
							Sign in to your {isSeller ? 'seller ' : ' '} account
						</h1>

						<Link
							className={buttonVariants({
								variant: 'link',
								className: 'text-muted-foreground text-yellow-600 gap-1.5',
							})}

							href='/sign-up'>
							Don&apos;t have an account? Sign up
							<GoArrowRight />
						</Link>
					</div>
					<div className='grid gap-6'>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className='grid gap-2'>
								<div className='grip gap-1 py-2'>
									<Label htmlFor='email'>Email</Label>
									<Input
										{...register('email')}
										className={cn({
											'focus-visible:ring-red-500': errors.email

										})}
										placeholder='you@example.com'
									/>
									{errors?.email && <p className='text-sm text-red-500 pt-2'>{errors.email.message}</p>}
								</div>
								<div className='grip gap-1 py-2'>
									<Label htmlFor='password'>Password</Label>
									<Input
										{...register('password')}
										type='password'
										className={cn({
											'focus-visible:ring-red-500': errors.password

										})}
										placeholder='Password'
									/>
									{errors?.password && <p className='text-sm text-red-500 pt-2'>{errors.password.message}</p>}
								</div>
								<Button>Sing in</Button>
							</div>
						</form>
						<div className='relative'>
							<div aria-hidden='true' className='absolute inset-0 flex items-center'>
								<span className='w-full border-t' />
							</div>
							<div className='relative flex justify-center text-xs uppercase'>
								<span className='bg-background px-2 text-muted-foreground'>
									or
								</span>
							</div>
						</div>
						{isSeller ? (
							<Button
								onClick={continueAsBuyer}
								variant='secondary'
								disabled={isLoading}
							>
								Continue as customer
							</Button>
						) : (
							<Button
								onClick={continueAsSeller}
								variant='secondary'
								disabled={isLoading}
							>
								Continue as seller
							</Button>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default Page