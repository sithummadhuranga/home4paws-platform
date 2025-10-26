"use client"

import React from "react"
import { Container } from "@/components/common/Container"
import { Shield, Clock, Heart, Users, Award, Sparkles, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
	{
		icon: Shield,
		title: "Verified Shelters",
		description: "All partner shelters are thoroughly vetted and verified for your peace of mind.",
		color: "from-purple-500 to-purple-400",
		bgColor: "bg-purple-900/20 dark:bg-purple-900/20",
		iconColor: "text-purple-400 dark:text-purple-300",
		highlights: ["Licensed & Insured", "Background Checked", "Quality Certified"],
	},
	{
		icon: Clock,
		title: "24/7 Support",
		description: "Round-the-clock assistance for all your pet adoption questions and needs.",
		color: "from-purple-500 to-purple-400",
		bgColor: "bg-purple-900/20 dark:bg-purple-900/20",
		iconColor: "text-purple-400 dark:text-purple-300",
		highlights: ["Instant Response", "Expert Guidance", "Multi-channel Help"],
	},
	{
		icon: Heart,
		title: "Perfect Matches",
		description: "Advanced matching algorithm to find pets that fit your lifestyle perfectly.",
		color: "from-purple-500 to-purple-400",
		bgColor: "bg-purple-900/20 dark:bg-purple-900/20",
		iconColor: "text-purple-400 dark:text-purple-300",
		highlights: ["AI-Powered", "Personality Matching", "Lifestyle Compatible"],
	},
	{
		icon: Users,
		title: "Community Support",
		description: "Join a caring community of 50,000+ pet parents sharing tips and stories.",
		color: "from-purple-500 to-purple-400",
		bgColor: "bg-purple-900/20 dark:bg-purple-900/20",
		iconColor: "text-purple-400 dark:text-purple-300",
		highlights: ["Active Forums", "Expert Advice", "Success Stories"],
	},
	{
		icon: Award,
		title: "Success Guarantee",
		description: "99% success rate with comprehensive support throughout the adoption process.",
		color: "from-purple-500 to-purple-400",
		bgColor: "bg-purple-900/20 dark:bg-purple-900/20",
		iconColor: "text-purple-400 dark:text-purple-300",
		highlights: ["Proven Track Record", "Full Support", "Happy Families"],
	},
	{
		icon: Sparkles,
		title: "Lifetime Care",
		description: "Ongoing resources, training tips, and vet recommendations for life.",
		color: "from-purple-500 to-purple-400",
		bgColor: "bg-purple-900/20 dark:bg-purple-900/20",
		iconColor: "text-purple-400 dark:text-purple-300",
		highlights: ["Training Resources", "Health Tips", "Vet Network"],
	},
]

export default function FeatureGrid() {
	return (
		<section className="relative py-16 sm:py-20 lg:py-28 bg-black dark:bg-black overflow-hidden">
			{/* Enhanced Background Elements */}
			<div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
			<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

			<Container className="relative z-10">
				{/* Header - Enhanced with Badge */}
				<div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fadeInUp">
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/80 dark:bg-neutral-900/80 backdrop-blur-sm border border-purple-400/30 dark:border-purple-400/30 mb-6 shadow-lg shadow-purple-500/10">
						<Sparkles className="w-4 h-4 text-purple-400 dark:text-purple-300 mr-2 animate-pulse" />
						<span className="text-sm font-medium text-purple-200 dark:text-purple-200 font-inter">
							Why Choose Us
						</span>
					</div>

					<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-purple-200 dark:text-purple-200 mb-6 leading-tight px-4 font-urbanist">
						Everything You Need for
						<span className="block sm:inline sm:ml-3 mt-2 sm:mt-0 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent animate-gradient">
							Successful Adoption
						</span>
					</h2>

					<p className="text-base sm:text-lg lg:text-xl text-purple-300 dark:text-purple-300 max-w-3xl mx-auto leading-relaxed px-4 font-inter">
						From verified shelters to lifetime support, we&apos;ve built the most comprehensive pet adoption
						platform.
						<span className="font-semibold text-purple-400 dark:text-purple-400"> Your perfect companion awaits.</span>
					</p>
				</div>

				{/* Features Grid - Enhanced with Interactive Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-16">
					{features.map((feature, index) => (
						<div
							key={index}
							className="group relative animate-fadeInUp"
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							{/* Gradient Border Effect */}
							<div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-all duration-500" />

							{/* Card Content */}
							<div className="relative bg-neutral-900/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-purple-400/20 dark:border-purple-400/20 group-hover:border-purple-400/40 dark:group-hover:border-purple-400/40 h-full flex flex-col">
								{/* Icon Container with Glow */}
								<div className="relative mb-6">
									<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
									<div
										className={`relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 ${feature.bgColor} rounded-2xl group-hover:scale-110 transition-all duration-500 border border-purple-400/30 shadow-lg`}
									>
										<feature.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${feature.iconColor} group-hover:scale-110 transition-transform duration-500`} />
									</div>
								</div>

								{/* Content */}
								<div className="space-y-4 flex-grow">
									<h3 className="text-xl sm:text-2xl font-semibold text-purple-200 dark:text-purple-200 group-hover:text-purple-100 dark:group-hover:text-purple-100 transition-colors duration-300 font-urbanist">
										{feature.title}
									</h3>

									<p className="text-sm sm:text-base text-purple-300 dark:text-purple-300 leading-relaxed font-inter">
										{feature.description}
									</p>

									{/* Highlights List */}
									<ul className="space-y-2 pt-2">
										{feature.highlights.map((highlight, idx) => (
											<li
												key={idx}
												className="flex items-center text-sm text-purple-400 dark:text-purple-400 font-inter opacity-0 group-hover:opacity-100 transition-all duration-300"
												style={{ transitionDelay: `${idx * 50}ms` }}
											>
												<CheckCircle className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
												{highlight}
											</li>
										))}
									</ul>
								</div>

								{/* Hover Arrow Indicator */}
								<div className="mt-4 flex items-center text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
									<span className="text-sm font-medium font-inter mr-2">Learn more</span>
									<ArrowRight className="w-4 h-4" />
								</div>

								{/* Decorative Corner Element */}
								<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

								{/* Hover Glow Effect */}
								<div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
							</div>
						</div>
					))}
				</div>

				{/* Enhanced Stats Section */}
				<div className="relative">
					{/* Decorative Background */}
					<div className="absolute -inset-4 bg-gradient-to-r from-purple-900/10 via-purple-800/10 to-purple-900/10 rounded-3xl blur-2xl" />

					<div
						className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 animate-fadeInUp"
						style={{ animationDelay: "0.6s" }}
					>
						{[
							{ number: "15K+", label: "Adoptions", color: "text-purple-400", icon: Heart },
							{ number: "450+", label: "Shelters", color: "text-purple-400", icon: Users },
							{ number: "99%", label: "Success", color: "text-purple-400", icon: Award },
							{ number: "24/7", label: "Support", color: "text-purple-400", icon: Clock },
						].map((stat, index) => (
							<div
								key={index}
								className="group relative text-center p-6 sm:p-8 bg-neutral-900/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl border border-purple-400/20 dark:border-purple-400/20 hover:border-purple-400/40 dark:hover:border-purple-400/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10"
							>
								{/* Icon */}
								<div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-purple-900/30 rounded-xl border border-purple-400/30 group-hover:scale-110 transition-transform duration-300">
									<stat.icon className={`w-6 h-6 ${stat.color}`} />
								</div>

								{/* Number */}
								<div className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${stat.color} mb-2 font-urbanist group-hover:scale-110 transition-transform duration-300`}>
									{stat.number}
								</div>

								{/* Label */}
								<div className="text-sm sm:text-base text-purple-300 dark:text-purple-300 font-semibold font-inter uppercase tracking-wider">
									{stat.label}
								</div>

								{/* Decorative Glow */}
								<div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-400/0 group-hover:from-purple-500/5 group-hover:to-purple-400/5 rounded-2xl transition-all duration-500 pointer-events-none" />
							</div>
						))}
					</div>
				</div>

				{/* Call to Action - Enhanced */}
				<div className="mt-16 sm:mt-20 text-center animate-fadeInUp" style={{ animationDelay: "0.8s" }}>
					<div className="relative inline-block">
						{/* Glow Effect */}
						<div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

						<div className="relative bg-gradient-to-r from-purple-900/40 via-purple-800/40 to-purple-900/40 backdrop-blur-sm rounded-full p-1 border border-purple-400/30">
							<div className="bg-neutral-900/80 rounded-full px-8 py-6 sm:px-12 sm:py-8">
								<div className="flex flex-col sm:flex-row items-center gap-6">
									{/* Icon Group */}
									<div className="flex -space-x-3">
										{[Heart, Users, Award, Sparkles].map((Icon, i) => (
											<div
												key={i}
												className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 border-3 border-neutral-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
												style={{ animationDelay: `${i * 100}ms` }}
											>
												<Icon className="w-6 h-6 text-white" />
											</div>
										))}
									</div>

									{/* Text Content */}
									<div className="text-center sm:text-left">
										<h3 className="text-xl sm:text-2xl font-bold text-purple-200 mb-2 font-urbanist">
											Ready to Start Your Journey?
										</h3>
										<p className="text-purple-300 text-sm sm:text-base font-inter mb-4">
											Join 15,000+ families who found their perfect pet companion
										</p>

										{/* CTA Buttons */}
										<div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
											<Link href="/adopt">
												<Button
													size="lg"
													className="h-12 px-8 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 font-urbanist border-0 group"
												>
													Browse Pets
													<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
												</Button>
											</Link>
											<Link href="/about">
												<Button
													size="lg"
													variant="outline"
													className="h-12 px-8 rounded-full border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 font-semibold font-urbanist transition-all duration-300"
												>
													Learn More
												</Button>
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Container>

			{/* Additional Decorative Elements */}
			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
		</section>
	)
}