"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Container } from "@/components/common/Container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, Heart, ShoppingBag, Sparkles, TrendingUp, Award } from "lucide-react"

const items = [
	{
		title: "Premium Pet Supplies",
		subtitle: "Curated food, toys & essentials",
		img: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80",
		badge: "Best Sellers",
		price: "From $9.99",
		rating: 4.9,
		reviews: 1200,
	},
	{
		title: "Expert Grooming",
		subtitle: "Certified professionals near you",
		img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80",
		badge: "Verified",
		price: "From $25",
		rating: 4.8,
		reviews: 850,
	},
	{
		title: "Professional Training",
		subtitle: "Behavior experts & specialists",
		img: "https://images.unsplash.com/photo-1558944351-9f9a5d4f4f0a?w=800&q=80",
		badge: "Top Rated",
		price: "From $35",
		rating: 5.0,
		reviews: 642,
	},
	{
		title: "Luxury Accessories",
		subtitle: "Designer beds & comfort items",
		img: "https://images.unsplash.com/photo-1601758123927-3d6f52e5e44c?w=800&q=80",
		badge: "Premium",
		price: "From $19.99",
		rating: 4.7,
		reviews: 340,
	},
	{
		title: "Adoption Center",
		subtitle: "Verified listings & profiles",
		img: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&q=80",
		badge: "Trusted",
		price: "Free to browse",
		rating: 4.9,
		reviews: 2100,
	},
]

export default function MarketplaceHighlights() {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return (
			<section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/5">
				<Container>
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mb-8"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80"></div>
							))}
						</div>
					</div>
				</Container>
			</section>
		)
	}

	return (
		<section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/5">
			<Container>
				{/* Header */}
				<div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fadeInUp">
					<div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 mb-4 sm:mb-6">
						<ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mr-2" />
						<span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
							Marketplace
						</span>
					</div>

					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-4">
						Everything Your Pet
						<span className="text-gradient block sm:inline sm:ml-3">Needs</span>
					</h2>

					<p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
						From premium supplies to expert services, discover trusted providers for
						every aspect of pet care.
						<span className="font-semibold text-green-600 dark:text-green-400">
							{" "}
							All in one place.
						</span>
					</p>
				</div>

				{/* Premium Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10">
					{items.map((item, idx) => (
						<article
							key={idx}
							className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden animate-fadeInUp"
						>
							{/* Image Container */}
							<div className="relative aspect-[16/9] overflow-hidden">
								<Image
									src={item.img}
									alt={item.title}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-cover group-hover:scale-110 transition-transform duration-700"
								/>

								<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

								{/* Badge - Mobile Optimized */}
								<div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 px-2 py-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full border border-white/20">
									<Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
									<span className="text-xs font-semibold text-gray-900 dark:text-white">
										{item.badge}
									</span>
								</div>

								{/* Favorite Button - Mobile Optimized */}
								<button
									className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200 group"
									suppressHydrationWarning
								>
									<Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-300 group-hover:text-red-500 group-hover:scale-110 transition-all duration-200" />
								</button>

								{/* Rating Badge - Mobile Optimized */}
								<div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full">
									<Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-500 fill-current" />
									<span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
										{item.rating}
									</span>
									<span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:inline">
										({item.reviews})
									</span>
								</div>
							</div>

							{/* Content - Mobile Optimized */}
							<div className="p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3">
								{/* Header */}
								<div>
									<h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
										{item.title}
									</h3>
									<p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1 line-clamp-1">
										{item.subtitle}
									</p>
								</div>

								{/* Price & Trending */}
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span className="text-sm sm:text-base lg:text-lg font-bold text-green-600 dark:text-green-400">
											{item.price}
										</span>
										{item.rating >= 4.8 && (
											<div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 dark:bg-green-900/20 rounded-full">
												<TrendingUp className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-green-600" />
												<span className="text-xs font-medium text-green-700 dark:text-green-400 hidden sm:inline">
													Hot
												</span>
											</div>
										)}
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-2 pt-1">
									<Button
										className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm h-8 sm:h-9"
										size="sm"
									>
										Explore
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="border-2 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 w-8 h-8 sm:w-9 sm:h-9 p-0"
									>
										<Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
									</Button>
								</div>
							</div>

							{/* Hover Glow Effect */}
							<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
						</article>
					))}
				</div>

				{/* Bottom CTA - Completely Mobile Responsive */}
				<div className="text-center animate-fadeInUp stagger-3">
					<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl text-white max-w-5xl mx-auto overflow-hidden">
						
						{/* Mobile Layout - Stacked */}
						<div className="block sm:hidden space-y-4">
							{/* Icons */}
							<div className="flex items-center justify-center gap-2">
								<div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
									<Sparkles className="w-4 h-4 text-white" />
								</div>
								<div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
									<Star className="w-4 h-4 text-yellow-300 fill-current" />
								</div>
							</div>
							
							{/* Text Content */}
							<div className="text-center px-2">
								<h3 className="text-lg font-bold mb-1 leading-tight">
									Join 50,000+ Happy Pet Parents
								</h3>
								<p className="text-blue-100 text-sm mb-4 leading-relaxed">
									Discover premium products & trusted services
								</p>
								<Link href="/marketplace" className="block">
									<Button size="lg" variant="secondary" className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg">
										Browse All →
									</Button>
								</Link>
							</div>
						</div>

						{/* Tablet Layout - Side by Side but Compact */}
						<div className="hidden sm:flex lg:hidden items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className="flex -space-x-1">
									<div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
										<Sparkles className="w-5 h-5 text-white" />
									</div>
									<div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
										<Star className="w-5 h-5 text-yellow-300 fill-current" />
									</div>
								</div>
								<div className="text-left">
									<h3 className="text-lg font-bold mb-1">Join 50K+ Happy Families</h3>
									<p className="text-blue-100 text-sm">Premium products & services</p>
								</div>
							</div>
							<Link href="/marketplace">
								<Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold whitespace-nowrap">
									Browse All →
								</Button>
							</Link>
						</div>

						{/* Desktop Layout - Full Width */}
						<div className="hidden lg:flex items-center justify-between gap-6">
							<div className="flex items-center gap-4">
								<div className="flex -space-x-1">
									<div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
										<Sparkles className="w-6 h-6 text-white" />
									</div>
									<div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
										<Star className="w-6 h-6 text-yellow-300 fill-current" />
									</div>
								</div>
								<div className="text-left">
									<h3 className="text-xl font-bold mb-1">Join 50,000+ Happy Pet Parents</h3>
									<p className="text-blue-100 text-sm">Discover premium products & trusted services</p>
								</div>
							</div>
							<Link href="/marketplace">
								<Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
									Browse All →
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</Container>
		</section>
	)
}