"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Filter, Heart, ArrowRight, Users, Award, Clock, Sparkles } from "lucide-react"
import { useState, memo } from "react"

const stats = [
	{ number: "15K+", label: "Happy Adoptions", icon: Heart, color: "text-blue-600" },
	{ number: "450+", label: "Partner Shelters", icon: Users, color: "text-green-600" },
	{ number: "99%", label: "Success Rate", icon: Award, color: "text-orange-600" },
	{ number: "24/7", label: "Support", icon: Clock, color: "text-purple-600" }
] as const

// Mobile-optimized stat card
const StatCard = memo(({ stat, index }: { stat: (typeof stats)[number]; index: number }) => (
	<div className="text-center animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
		<div className="flex items-center justify-center mb-2">
			<div className="p-2 sm:p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
				<stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
			</div>
		</div>
		<div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
			{stat.number}
		</div>
		<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
			{stat.label}
		</div>
	</div>
))
StatCard.displayName = "StatCard"

// Mobile-first search bar
const SearchBar = memo(({ searchQuery, setSearchQuery }: { 
	searchQuery: string
	setSearchQuery: (value: string) => void
}) => (
	<div className="relative group">
		<div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl opacity-20 blur group-hover:opacity-30 transition-opacity duration-300" />
		
		<div className="relative bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-xl border border-gray-100 dark:border-gray-700">
			<div className="space-y-4">
				{/* Search Input */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<Input
						placeholder="Search pets by breed, age, or location..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 rounded-lg text-base bg-gray-50 dark:bg-gray-700"
					/>
				</div>
				
				{/* Mobile Buttons */}
				<div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
					<Button 
						variant="outline" 
						size="sm"
						className="h-10 text-sm border-2 hover:border-blue-500 hover:text-blue-600"
					>
						<MapPin className="w-4 h-4 mr-1 sm:mr-2" />
						<span className="hidden xs:inline">Location</span>
						<span className="xs:hidden">Loc</span>
					</Button>
					<Button 
						variant="outline" 
						size="sm"
						className="h-10 text-sm border-2 hover:border-blue-500 hover:text-blue-600"
					>
						<Filter className="w-4 h-4 mr-1 sm:mr-2" />
						<span className="hidden xs:inline">Filters</span>
						<span className="xs:hidden">Filter</span>
					</Button>
					<Button 
						className="col-span-2 sm:col-span-1 h-10 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
					>
						<Search className="w-4 h-4 mr-2" />
						Search Pets
					</Button>
				</div>
			</div>
		</div>
	</div>
))
SearchBar.displayName = "SearchBar"

export default function Hero() {
	const [searchQuery, setSearchQuery] = useState("")

	return (
		<section className="relative pt-16 sm:pt-20 pb-8 sm:pb-12 overflow-hidden">
			{/* Mobile-optimized background */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/10" />
			
			<div className="relative container mx-auto">
				<div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
					
					{/* Left Content - Mobile First */}
					<div className="space-y-6 sm:space-y-8 text-center lg:text-left animate-fadeIn">
						{/* Badges */}
						<div className="flex flex-wrap justify-center lg:justify-start gap-2">
							<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
								<Sparkles className="w-3 h-3 mr-1" />
								#1 Pet Platform
							</span>
							<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
								✅ Verified Shelters
							</span>
						</div>

						{/* Headlines */}
						<div className="space-y-4">
							<h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
								Find Your Perfect
								<span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
									Furry Friend
								</span>
							</h1>
							
							<p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
								Connect with loving pets from verified shelters. Fast, secure, and completely free. 
								<span className="font-semibold text-blue-600 dark:text-blue-400">Over 15,000 successful adoptions!</span>
							</p>
						</div>

						{/* Mobile-first search */}
						<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
							<Link href="/adopt">
								<Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg px-6 sm:px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl">
									Start Adopting
									<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
								</Button>
							</Link>
							<Link href="/about">
								<Button variant="outline" size="lg" className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg px-6 sm:px-8 border-2">
									Learn More
								</Button>
							</Link>
						</div>

						{/* Stats Grid - Mobile Optimized */}
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8">
							{stats.map((stat, index) => (
								<StatCard key={stat.label} stat={stat} index={index} />
							))}
						</div>
					</div>

					{/* Right Content - Mobile Hidden, Desktop Visible */}
					<div className="hidden lg:block relative">
						<div className="relative z-10 animate-scaleIn">
							{/* Featured Pet Card */}
							<div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
								<div className="aspect-[4/3] relative">
									<Image
										src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&h=400&fit=crop"
										alt="Adorable golden retriever"
										fill
										sizes="(max-width: 1024px) 100vw, 50vw"
										className="object-cover"
										priority
									/>
									<div className="absolute top-4 left-4">
										<span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
											Available
										</span>
									</div>
									<div className="absolute top-4 right-4">
										<button
											type="button"
											className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200"
											aria-label="Add to favorites"
											suppressHydrationWarning
										>
											<Heart className="w-5 h-5 text-red-500" />
										</button>
									</div>
								</div>
								
								<div className="p-6">
									<div className="flex items-center justify-between mb-3">
										<h3 className="text-xl font-bold text-gray-900 dark:text-white">Luna</h3>
										<span className="text-sm text-gray-500 dark:text-gray-400">2 years old</span>
									</div>
									<p className="text-gray-600 dark:text-gray-300 mb-4">Golden Retriever • Female • New York</p>
									<Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
										Meet Luna
									</Button>
								</div>
							</div>
							
							{/* Floating elements */}
							<div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl" />
							<div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-xl" />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}