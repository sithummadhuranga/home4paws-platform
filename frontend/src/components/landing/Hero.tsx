"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Filter, Heart, ArrowRight, Star, Users, Award, Clock, Sparkles } from "lucide-react"
import { useState, memo, useMemo } from "react"

const stats = [
	{ number: "15K+", label: "Happy Adoptions", icon: Heart, color: "text-blue-600" },
	{ number: "450+", label: "Partner Shelters", icon: Users, color: "text-green-600" },
	{ number: "99%", label: "Success Rate", icon: Award, color: "text-orange-600" },
	{ number: "24/7", label: "Support", icon: Clock, color: "text-purple-600" }
] as const;

// Magical stat card
const StatCard = memo(({ stat, index }: { stat: typeof stats[0]; index: number }) => (
	<div 
		className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300"
		style={{ animationDelay: `${index * 0.1}s` }}
	>
		<div className="flex items-center justify-center mb-3">
			<div className="relative p-3 rounded-2xl bg-white shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200">
				<stat.icon className={`w-6 h-6 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
				<div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
			</div>
		</div>
		<div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors duration-300">
			{stat.number}
		</div>
		<div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
			{stat.label}
		</div>
	</div>
));

StatCard.displayName = "StatCard";

// Magical search bar (always light theme)
const SearchBar = memo(({ searchQuery, setSearchQuery }: { 
	searchQuery: string; 
	setSearchQuery: (value: string) => void; 
}) => (
	<div className="relative group">
		{/* Magical glow effect */}
		<div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
		
		<div className="relative bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 group-hover:shadow-3xl transition-all duration-500">
			{/* Sparkle effects */}
			<div className="absolute top-2 right-2">
				<Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
			</div>
			
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="flex-1 relative">
					<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors duration-200 group-focus-within:text-blue-500" />
					<Input
						placeholder="Search by breed, age, or location..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-12 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl text-base font-medium bg-white text-gray-900 placeholder:text-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
					/>
				</div>
				
				<div className="flex gap-3">
					<Button 
						variant="outline" 
						className="h-14 px-6 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-xl font-medium shadow-sm hover:shadow-md bg-white text-gray-700"
					>
						<MapPin className="w-4 h-4 mr-2" />
						Location
					</Button>
					<Button 
						variant="outline" 
						className="h-14 px-6 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-xl font-medium shadow-sm hover:shadow-md bg-white text-gray-700"
					>
						<Filter className="w-4 h-4 mr-2" />
						Filters
					</Button>
					<Button 
						className="h-14 px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-xl"
					>
						<Search className="w-4 h-4 mr-2" />
						Search Pets
					</Button>
				</div>
			</div>
		</div>
	</div>
));

SearchBar.displayName = "SearchBar";

export default function Hero() {
	const [searchQuery, setSearchQuery] = useState("")

	// Memoize static content for better performance
	const featuredPets = useMemo(() => [
		{ name: "Luna", breed: "Golden Retriever", age: "2 years", image: "/next.svg", location: "New York" },
		{ name: "Max", breed: "German Shepherd", age: "3 years", image: "/next.svg", location: "California" },
		{ name: "Bella", breed: "Persian Cat", age: "1 year", image: "/next.svg", location: "Texas" }
	], []);

	return (
		<section className="relative pt-16 pb-12 lg:pt-20 lg:pb-16 overflow-hidden">
			{/* Magical background */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/10" />
				<div className="absolute top-0 left-0 w-full h-full opacity-40">
					<div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
					<div className="absolute bottom-20 right-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
				</div>
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
					
					{/* Left Content */}
					<div className="space-y-8 animate-fadeIn">
						<div className="space-y-6">
							{/* Status badge */}
							<div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50">
								<div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse" />
								<Star className="w-4 h-4 mr-2 text-yellow-500" />
								847 pets found homes this month
								<Sparkles className="w-4 h-4 ml-2 text-yellow-500 animate-pulse" />
							</div>
							
							{/* Hero heading */}
							<h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
								Find your perfect{" "}
								<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
									furry friend
								</span>
							</h1>
							
							{/* Description */}
							<p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl font-medium">
								Connect with loving pets from verified shelters. Browse thousands of dogs, cats, and other animals waiting for their forever homes. Start your adoption journey today! 🐾
							</p>
						</div>

						{/* Magical search bar */}
						<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

						{/* Action buttons */}
						<div className="flex flex-col sm:flex-row gap-4">
							<Link href="/adopt" className="group">
								<Button 
									size="lg" 
									className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl text-white"
								>
									<Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
									Browse All Pets
									<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
								</Button>
							</Link>
							<Link href="/shelters" className="group">
								<Button 
									variant="outline" 
									size="lg" 
									className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 rounded-xl bg-white text-gray-700"
								>
									Find Shelters
									<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
								</Button>
							</Link>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
							{stats.map((stat, index) => (
								<StatCard key={stat.label} stat={stat} index={index} />
							))}
						</div>
					</div>

					{/* Right Content - Enhanced Pet Card */}
					<div className="relative">
						<div className="relative z-10">
							{/* Main pet card with magical effects */}
							<div className="relative group">
								{/* Magical glow */}
								<div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
								
								<div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-500">
									<div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 mb-6 group-hover:scale-105 transition-transform duration-500">
										<Image
											src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop"
											alt="Adorable golden retriever puppy available for adoption"
											fill
											className="object-cover"
											priority
											sizes="(max-width: 768px) 100vw, 50vw"
										/>
										
										{/* Status badges */}
										<div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
											Available Now
										</div>
										
										<div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-md">
											⭐ Top Pick
										</div>
									</div>
									
									{/* Pet info */}
									<div className="space-y-4">
										<div>
											<h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">Luna 🐕</h3>
											<p className="text-gray-600 dark:text-gray-400 font-medium">Golden Retriever • 2 years old</p>
											<div className="flex items-center mt-2">
												<MapPin className="w-4 h-4 mr-2 text-gray-400" />
												<span className="text-sm text-gray-500 font-medium">San Francisco, CA</span>
											</div>
										</div>
										
										<div className="flex gap-2 flex-wrap">
											<span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Friendly</span>
											<span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Vaccinated</span>
											<span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">House Trained</span>
										</div>
										
										<Button 
											className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl py-3"
										>
											<Heart className="w-5 h-5 mr-2" />
											Meet Luna Today
											<Sparkles className="w-4 h-4 ml-2 animate-pulse" />
										</Button>
									</div>
								</div>
							</div>

							{/* Floating mini cards */}
							<div className="absolute -top-6 -left-6 w-24 h-24 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 animate-float">
								<Image
									src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=80&h=80&fit=crop"
									alt="Cat"
									width={64}
									height={64}
									className="rounded-xl object-cover"
								/>
							</div>
							
							<div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-gray-700 animate-float" style={{ animationDelay: '0.5s' }}>
								<Image
									src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=60&h=60&fit=crop"
									alt="Rabbit"
									width={56}
									height={56}
									className="rounded-xl object-cover"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}