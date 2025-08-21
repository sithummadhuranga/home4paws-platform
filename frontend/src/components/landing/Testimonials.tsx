"use client"

import React, { useState, useEffect } from "react"
import { Container } from "@/components/common/Container"
import { Star, Quote, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const testimonials = [
	{
		id: 1,
		name: "Sarah Chen",
		role: "Dog Mom",
		location: "San Francisco, CA",
		image: "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=80&h=80&fit=crop&crop=face",
		rating: 5,
		text: "PawsHome made adopting Luna incredibly smooth. The staff was amazing, and the whole process took just 3 days from first contact to bringing her home!",
		petName: "Luna",
		petType: "Golden Retriever",
		adoptionDate: "2 months ago",
	},
	{
		id: 2,
		name: "Marcus Rodriguez",
		role: "Cat Dad",
		location: "Austin, TX",
		image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
		rating: 5,
		text: "The matching algorithm is incredible! They found Oliver, who fits perfectly with our family's lifestyle. Best decision we ever made.",
		petName: "Oliver",
		petType: "Maine Coon",
		adoptionDate: "6 months ago",
	},
	{
		id: 3,
		name: "Emily Johnson",
		role: "Animal Lover",
		location: "Seattle, WA",
		image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
		rating: 5,
		text: "Adopted two rescue bunnies through PawsHome. The support team guided us through everything, and now Milo and Zoe are thriving in their forever home!",
		petName: "Milo & Zoe",
		petType: "Holland Lop Bunnies",
		adoptionDate: "4 months ago",
	},
	{
		id: 4,
		name: "David Kim",
		role: "First-time Owner",
		location: "Portland, OR",
		image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
		rating: 5,
		text: "As a first-time pet owner, I was nervous. PawsHome's resources and shelter guidance made the transition seamless. Charlie is now my best friend!",
		petName: "Charlie",
		petType: "Border Collie Mix",
		adoptionDate: "1 month ago",
	},
	{
		id: 5,
		name: "Lisa Thompson",
		role: "Senior Adopter",
		location: "Phoenix, AZ",
		image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&h=80&fit=crop&crop=face",
		rating: 5,
		text: "Found the perfect senior cat companion through PawsHome. Whiskers and I are both seniors now, and we take care of each other beautifully.",
		petName: "Whiskers",
		petType: "Senior Tabby",
		adoptionDate: "8 months ago",
	},
]

export default function Testimonials() {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [autoPlay, setAutoPlay] = useState(false)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		// Start autoplay after mount
		setAutoPlay(true)
	}, [])

	// Auto-play functionality
	useEffect(() => {
		if (autoPlay && mounted) {
			const interval = setInterval(() => {
				setCurrentIndex((prev) => (prev + 1) % testimonials.length)
			}, 5000)
			return () => clearInterval(interval)
		}
	}, [autoPlay, mounted])

	const nextTestimonial = () => {
		setCurrentIndex((prev) => (prev + 1) % testimonials.length)
	}

	const prevTestimonial = () => {
		setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
	}

	if (!mounted) {
		return (
			<section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/10">
				<Container>
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4 mx-auto"></div>
						<div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl max-w-4xl mx-auto"></div>
					</div>
				</Container>
			</section>
		)
	}

	return (
		<section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/10">
			<Container>
				{/* Header */}
				<div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fadeInUp">
					<div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 mb-4 sm:mb-6">
						<Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-2" />
						<span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Success Stories</span>
					</div>
					
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-4">
						What Adopters
						<span className="text-gradient block sm:inline sm:ml-3">Say</span>
					</h2>
					
					<p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
						Real families, real stories, real love. 
						<span className="font-semibold text-blue-600 dark:text-blue-400"> See why 15,000+ families trust PawsHome.</span>
					</p>
				</div>

				{/* Testimonial Carousel */}
				<div className="relative max-w-4xl mx-auto">
					{/* Main Testimonial */}
					<div 
						className="relative animate-fadeInUp px-4"
						onMouseEnter={() => setAutoPlay(false)}
						onMouseLeave={() => setAutoPlay(true)}
					>
						<div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
							{/* Quote Icon */}
							<div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-blue-100 dark:text-blue-900/20">
								<Quote className="w-8 h-8 sm:w-12 sm:h-12 fill-current" />
							</div>

							{/* Rating */}
							<div className="flex items-center gap-1 mb-4 sm:mb-6">
								{[...Array(testimonials[currentIndex].rating)].map((_, i) => (
									<Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" />
								))}
							</div>

							{/* Testimonial Text */}
							<blockquote className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8 font-medium">
								&ldquo;{testimonials[currentIndex].text}&rdquo;
							</blockquote>

							{/* Author Info - Mobile Optimized */}
							<div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
								<div className="relative">
									<Image
										src={testimonials[currentIndex].image}
										alt={testimonials[currentIndex].name}
										width={60}
										height={60}
										className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
									/>
									<div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
										<Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-current" />
									</div>
								</div>
								
								<div className="flex-1 text-center sm:text-left">
									<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
										<h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
											{testimonials[currentIndex].name}
										</h4>
										<span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">•</span>
										<span className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">
											{testimonials[currentIndex].role}
										</span>
									</div>
									<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
										{testimonials[currentIndex].location}
									</p>
								</div>

								{/* Pet Info */}
								<div className="text-center sm:text-right">
									<p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
										Adopted {testimonials[currentIndex].petName}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{testimonials[currentIndex].petType}
									</p>
									<p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
										{testimonials[currentIndex].adoptionDate}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Navigation Buttons - Mobile Optimized */}
					<button
						onClick={prevTestimonial}
						className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 z-10"
						suppressHydrationWarning
					>
						<ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300" />
					</button>
					
					<button
						onClick={nextTestimonial}
						className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 z-10"
						suppressHydrationWarning
					>
						<ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300" />
					</button>
				</div>

				{/* Pagination Dots - Mobile Optimized */}
				<div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 animate-fadeInUp stagger-2">
					{testimonials.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
								currentIndex === index 
									? "bg-blue-600 scale-125" 
									: "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
							}`}
							suppressHydrationWarning
						/>
					))}
				</div>

				{/* Stats Footer */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 animate-fadeInUp stagger-3">
					<div className="text-center p-4 sm:p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
						<div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">4.9★</div>
						<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
					</div>
					<div className="text-center p-4 sm:p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
						<div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">15K+</div>
						<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Happy Families</p>
					</div>
					<div className="text-center p-4 sm:p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
						<div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">98%</div>
						<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
					</div>
				</div>
			</Container>
		</section>
	)
}