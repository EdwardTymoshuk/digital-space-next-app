'use client'

import { TQueryValidator } from '@/lib/validators/query-validator'
import { Product } from '@/payload-types'
import { trpc } from '@/trpc/client'
import Link from 'next/link'
import ProductListing from './ProductListing'

interface ProductReelProps {
	title: string,
	subtitle?: string,
	href?: string,
	query: TQueryValidator,
}

const FALLBACK_LIMIT = 4

const ProductReel = (props: ProductReelProps) => {
	const { title, subtitle, href, query } = props

	const { data: queryResults, isLoading } = trpc.getInfiniteProducts.useInfiniteQuery({
		limit: query.limit ?? FALLBACK_LIMIT, query
	}, {
		getNextPageParam: (lastPage) => lastPage.nextPage,
	})

	console.log(queryResults)

	const products = queryResults?.pages.flatMap((page) => page.items)

	let map: (Product | null)[] = []
	if(products && products.length) {
		map = products
	} else if (isLoading) {
		map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null)
	}

	console.log(products, map)
	return (
		<section className='py-12'>
			<div className='md:flex md:itex-center md:justify-between mb-4'>
				<div className='max-w-2xl px-4 lg:max-w-4xl lg:px-0'>
					{title ? (
						<h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
							{title}
						</h1>
					) : null}
					{subtitle ? (
						<p className='text-sm mt-2 text-muted-foreground'>
							{subtitle}
						</p>
					) : null}
				</div>
				{href ?
					<Link href={href} className='hidden md:block font-medium text-sm text-yellow-600 hover:text-yellow-500'>Shop the collecttion <span aria-hidden='true'>&rarr;</span></Link> :
					null
				}
			</div>
			<div className='relative'>
				<div className='mt-6 flex items-center w-full'>
					<div className='w-full grid grid-cols-2 md:grid-col-4 gap-x-4 md:gap-x-6 lg:gap-x-8 gap-y-10'>
						{map.map((product, i) => (
							<ProductListing product={product} index={i} key={`product-${i}`} />
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default ProductReel
