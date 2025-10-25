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
		img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop&q=80",
		badge: "Best Sellers",
		price: "From $9.99",
		rating: 4.9,
		reviews: 1200,
	},
	{
		title: "Expert Grooming",
		subtitle: "Certified professionals near you",
		img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop&q=80",
		badge: "Verified",
		price: "From $25",
		rating: 4.8,
		reviews: 850,
	},
	{
		title: "Professional Training",
		subtitle: "Behavior experts & specialists",
		img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=80",
		badge: "Top Rated",
		price: "From $35",
		rating: 5.0,
		reviews: 642,
	},
	{
		title: "Luxury Accessories",
		subtitle: "Designer beds & comfort items",
		img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop&q=80",
		badge: "Premium",
		price: "From $19.99",
		rating: 4.7,
		reviews: 340,
	},
	{
		title: "Adoption Center",
		subtitle: "Verified listings & profiles",
		img: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&auto=format&fit=crop&q=80",
		badge: "Trusted",
		price: "Free to browse",
		rating: 4.9,
		reviews: 2100,
	},
]

export default function MarketplaceHighlights() {
	const [mounted, setMounted] = useState(false)
	const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

	useEffect(() => {
		setMounted(true)
	}, [])

	const handleImageError = (index: number) => {
		setImageErrors((prev) => ({ ...prev, [index]: true }))
	}

	// Fallback image URL
	const getFallbackImage = (index: number) => {
		const fallbackImages = [
			"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop&q=80",
			"https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop&q=80",
			"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=80",
			"https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop&q=80",
			"https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&auto=format&fit=crop&q=80",
		]
		return fallbackImages[index % fallbackImages.length]
	}

	if (!mounted) {
		return (
			<section className="py-12 sm:py-16 lg:py-20 bg-black dark:bg-black">
				<Container>
					<div className="animate-pulse">
						<div className="h-8 bg-neutral-800 dark:bg-neutral-800 rounded w-64 mb-4"></div>
						<div className="h-4 bg-neutral-800 dark:bg-neutral-800 rounded w-96 mb-8"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="bg-neutral-800 dark:bg-neutral-800 rounded-2xl h-80"></div>
							))}
						</div>
					</div>
				</Container>
			</section>
		)
	}

	return (
		<section className="py-12 sm:py-16 lg:py-20 bg-black dark:bg-black">
			<Container>
				{/* Header */}
				<div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fadeInUp">
					<div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-neutral-900/80 dark:bg-neutral-900/80 backdrop-blur-sm border border-purple-400/20 dark:border-purple-400/20 mb-4 sm:mb-6">
						<ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 mr-2" />
						<span className="text-xs sm:text-sm font-medium text-purple-200 dark:text-purple-200 font-inter">
							Marketplace
						</span>
					</div>

					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-purple-200 dark:text-purple-200 mb-4 sm:mb-6 leading-tight px-4 font-urbanist">
						Everything Your Pet
						<span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block sm:inline sm:ml-3">
							Needs
						</span>
					</h2>

					<p className="text-sm sm:text-base lg:text-lg text-purple-300 dark:text-purple-300 max-w-3xl mx-auto leading-relaxed px-4 font-inter tracking-[-0.30px]">
						From premium supplies to expert services, discover trusted providers for
						every aspect of pet care.
						<span className="font-semibold text-purple-400 dark:text-purple-400">
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
							className="group relative bg-neutral-900 dark:bg-neutral-900 rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-500 border border-purple-400/20 dark:border-purple-400/20 hover:border-purple-400/30 dark:hover:border-purple-400/30 overflow-hidden animate-fadeInUp"
							style={{ animationDelay: `${idx * 0.1}s` }}
						>
							{/* Image Container */}
							<div className="relative aspect-[16/9] overflow-hidden bg-neutral-800">
								<Image
									src={imageErrors[idx] ? getFallbackImage(idx) : item.img}
									alt={item.title}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-cover group-hover:scale-110 transition-transform duration-700"
									onError={() => handleImageError(idx)}
									loading="lazy"
								/>

								<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

								{/* Badge - Mobile Optimized */}
								<div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 px-2 py-1 bg-black/80 dark:bg-black/80 backdrop-blur-sm rounded-full border border-purple-400/30">
									<Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400" />
									<span className="text-xs font-medium text-purple-200 dark:text-purple-200 font-inter">
										{item.badge}
									</span>
								</div>

								{/* Favorite Button - Mobile Optimized */}
								<button
									className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-black/60 dark:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-black/80 dark:hover:bg-black/80 transition-colors duration-200 group"
									suppressHydrationWarning
								>
									<Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300 dark:text-purple-300 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-200" />
								</button>

								{/* Rating Badge - Mobile Optimized */}
								<div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-black/80 dark:bg-black/80 backdrop-blur-sm rounded-full">
									<Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400 fill-current" />
									<span className="text-xs sm:text-sm font-medium text-purple-200 dark:text-purple-200 font-inter">
										{item.rating}
									</span>
									<span className="text-xs text-purple-300 dark:text-purple-300 hidden sm:inline font-inter">
										({item.reviews})
									</span>
								</div>
							</div>

							{/* Content - Mobile Optimized */}
							<div className="p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3">
								{/* Header */}
								<div>
									<h3 className="text-base sm:text-lg lg:text-xl font-semibold text-purple-200 dark:text-purple-200 group-hover:text-purple-300 dark:group-hover:text-purple-300 transition-colors duration-300 line-clamp-1 font-inter">
										{item.title}
									</h3>
									<p className="text-purple-300 dark:text-purple-300 text-xs sm:text-sm mt-1 line-clamp-1 font-inter">
										{item.subtitle}
									</p>
								</div>

								{/* Price & Trending */}
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span className="text-sm sm:text-base lg:text-lg font-semibold text-purple-400 dark:text-purple-400 font-inter">
											{item.price}
										</span>
										{item.rating >= 4.8 && (
											<div className="flex items-center gap-1 px-1.5 py-0.5 bg-purple-900/20 dark:bg-purple-900/20 rounded-full">
												<TrendingUp className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-purple-400" />
												<span className="text-xs font-medium text-purple-400 dark:text-purple-400 hidden sm:inline font-inter">
													Hot
												</span>
											</div>
										)}
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-2 pt-1">
									<Button
										className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-[32px] hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg shadow-purple-500/20 font-inter font-medium text-white text-xs sm:text-sm h-8 sm:h-9"
										size="sm"
									>
										Explore
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="border-2 border-purple-400/50 rounded-[32px] hover:bg-purple-500/10 text-purple-200 font-inter font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 w-8 h-8 sm:w-9 sm:h-9 p-0"
									>
										<Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
									</Button>
								</div>
							</div>

							{/* Hover Glow Effect */}
							<div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-400/5 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
						</article>
					))}
				</div>

				{/* Bottom CTA - Completely Mobile Responsive */}
				<div className="text-center animate-fadeInUp stagger-3">
					<div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 rounded-[32px] p-4 sm:p-6 lg:p-8 shadow-xl text-white max-w-5xl mx-auto overflow-hidden">
						
						{/* Mobile Layout - Stacked */}
						<div className="block sm:hidden space-y-4">
							{/* Icons */}
							<div className="flex items-center justify-center gap-2">
								<div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
									<Sparkles className="w-4 h-4 text-white" />
								</div>
								<div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
									<Star className="w-4 h-4 text-purple-200 fill-current" />
								</div>
							</div>
							
							{/* Text Content */}
							<div className="text-center px-2">
								<h3 className="text-lg font-semibold mb-1 leading-tight font-inter">
									Join 50,000+ Happy Pet Parents
								</h3>
								<p className="text-purple-100 text-sm mb-4 leading-relaxed font-inter tracking-[-0.30px]">
									Discover premium products & trusted services
								</p>
								<Link href="/marketplace" className="block">
									<Button 
										size="lg" 
										className="w-full bg-white text-purple-600 hover:bg-purple-50 font-inter font-medium shadow-lg rounded-[32px]"
									>
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
										<Star className="w-5 h-5 text-purple-200 fill-current" />
									</div>
								</div>
								<div className="text-left">
									<h3 className="text-lg font-semibold mb-1 font-inter">Join 50K+ Happy Families</h3>
									<p className="text-purple-100 text-sm font-inter tracking-[-0.30px]">Premium products & services</p>
								</div>
							</div>
							<Link href="/marketplace">
								<Button 
									size="lg" 
									className="bg-white text-purple-600 hover:bg-purple-50 font-inter font-medium whitespace-nowrap rounded-[32px]"
								>
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
										<Star className="w-6 h-6 text-purple-200 fill-current" />
									</div>
								</div>
								<div className="text-left">
									<h3 className="text-xl font-semibold mb-1 font-inter">Join 50,000+ Happy Pet Parents</h3>
									<p className="text-purple-100 text-sm font-inter tracking-[-0.30px]">Discover premium products & trusted services</p>
								</div>
							</div>
							<Link href="/marketplace">
								<Button 
									size="lg" 
									className="bg-white text-purple-600 hover:bg-purple-50 font-inter font-medium rounded-[32px]"
								>
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