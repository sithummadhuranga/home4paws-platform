"use client"

import React from "react"
import { Container } from "@/components/common/Container"
import { Shield, Clock, Heart, Users, Award, Sparkles } from "lucide-react"

const features = [
	{
		icon: Shield,
		title: "Verified Shelters",
		description: "All partner shelters are thoroughly vetted and verified for your peace of mind.",
		color: "from-purple-500 to-purple-400",
		bgColor: "bg-purple-900/20 dark:bg-purple-900/20",
		iconColor: "text-purple-400 dark:text-purple-300",
	},
	{
		icon: Clock,
		title: "24/7 Support",
		description: "Round-the-clock assistance for all your pet adoption questions and needs.",
		color: "from-purple-500 to-purple-400",
		bgColor: "bg-purple-900/20 dark:bg-purple-900/20",
		iconColor: "text-purple-400 dark:text-purple-300",
	},
	{
		icon: Heart,
		title: "Perfect Matches",
		description: "Advanced matching algorithm to find pets that fit your lifestyle perfectly.",
		color: "from-purple-500 to-purple-400",
		bgColor: "bg-purple-900/20 dark:bg-purple-900/20",
		iconColor: "text-purple-400 dark:text-purple-300",
	},
	{
		icon: Users,
		title: "Community Support",
		description: "Join a caring community of 50,000+ pet parents sharing tips and stories.",
		color: "from-purple-500 to-purple-400",
		bgColor: "bg-purple-900/20 dark:bg-purple-900/20",
		iconColor: "text-purple-400 dark:text-purple-300",
	},
	{
		icon: Award,
		title: "Success Guarantee",
		description: "99% success rate with comprehensive support throughout the adoption process.",
		color: "from-purple-500 to-purple-400",
		bgColor: "bg-purple-900/20 dark:bg-purple-900/20",
		iconColor: "text-purple-400 dark:text-purple-300",
	},
	{
		icon: Sparkles,
		title: "Lifetime Care",
		description: "Ongoing resources, training tips, and vet recommendations for life.",
		color: "from-purple-500 to-purple-400",
		bgColor: "bg-purple-900/20 dark:bg-purple-900/20",
		iconColor: "text-purple-400 dark:text-purple-300",
	},
]

export default function FeatureGrid() {
	return (
		<section className="py-12 sm:py-16 lg:py-20 bg-black dark:bg-black">
			<Container>
				{/* Header - Mobile Optimized */}
				<div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fadeInUp">
					<div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-purple-900/20 dark:bg-purple-900/20 border border-purple-400/20 dark:border-purple-400/20 mb-4 sm:mb-6">
						<Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 dark:text-purple-300 mr-2" />
						<span className="text-xs sm:text-sm font-medium text-purple-200 dark:text-purple-200 font-inter">
							Why Choose Us
						</span>
					</div>

					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-purple-200 dark:text-purple-200 mb-4 sm:mb-6 leading-tight px-4 font-urbanist">
						Everything You Need for
						<span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block sm:inline sm:ml-3">
							Successful Adoption
						</span>
					</h2>

					<p className="text-sm sm:text-base lg:text-lg text-purple-300 dark:text-purple-300 max-w-3xl mx-auto leading-relaxed px-4 font-inter">
						From verified shelters to lifetime support, we&apos;ve built the most comprehensive pet adoption
						platform.
						<span className="font-semibold text-purple-400 dark:text-purple-400"> Your perfect companion awaits.</span>
					</p>
				</div>

				{/* Features Grid - Mobile Optimized */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							className="group relative bg-neutral-900 dark:bg-neutral-900 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-400/20 dark:border-purple-400/20 hover:border-purple-400/30 dark:hover:border-purple-400/30 animate-fadeInUp"
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							{/* Icon Container - Mobile Optimized */}
							<div
								className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 ${feature.bgColor} rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
							>
								<feature.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${feature.iconColor}`} />
							</div>

							{/* Content - Mobile Optimized */}
							<div className="space-y-2 sm:space-y-3">
								<h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-purple-200 dark:text-purple-200 group-hover:text-purple-300 dark:group-hover:text-purple-300 transition-colors duration-300 font-inter">
									{feature.title}
								</h3>

								<p className="text-sm sm:text-base text-purple-300 dark:text-purple-300 leading-relaxed font-inter">
									{feature.description}
								</p>
							</div>

							{/* Hover Glow Effect */}
							<div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
						</div>
					))}
				</div>

				{/* Bottom Stats - Mobile Optimized */}
				<div
					className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 animate-fadeInUp"
					style={{ animationDelay: "0.6s" }}
				>
					{[
						{ number: "15K+", label: "Adoptions", color: "text-purple-400" },
						{ number: "450+", label: "Shelters", color: "text-purple-400" },
						{ number: "99%", label: "Success", color: "text-purple-400" },
						{ number: "24/7", label: "Support", color: "text-purple-400" },
					].map((stat, index) => (
						<div
							key={index}
							className="text-center p-4 sm:p-6 bg-neutral-900 dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-purple-400/20 dark:border-purple-400/20"
						>
							<div className={`text-xl sm:text-2xl lg:text-3xl font-semibold ${stat.color} mb-1 sm:mb-2 font-inter`}>
								{stat.number}
							</div>
							<div className="text-xs sm:text-sm text-purple-300 dark:text-purple-300 font-medium font-inter">
								{stat.label}
							</div>
						</div>
					))}
				</div>
			</Container>
		</section>
	)
}