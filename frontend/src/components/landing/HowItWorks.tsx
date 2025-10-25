"use client"

import React from "react"
import { Search, Heart, Home, Check, ArrowRight, Sparkles } from "lucide-react"
import { Container } from "@/components/common/Container"

const steps = [
	{
		id: 1,
		icon: Search,
		title: "Discover Your Match",
		description:
			"Browse thousands of pets with advanced filters by breed, age, size, and personality traits.",
		color: "from-purple-500 to-purple-600",
		bgColor: "bg-purple-900/20 dark:bg-purple-900/20",
		iconColor: "text-purple-400 dark:text-purple-300",
		features: [
			"Smart matching algorithm",
			"Verified shelter profiles",
			"High-quality photos",
		],
	},
	{
		id: 2,
		icon: Heart,
		title: "Connect & Meet",
		description:
			"Schedule virtual or in-person meetups with shelters to find your perfect companion.",
		color: "from-purple-400 to-purple-500",
		bgColor: "bg-purple-900/15 dark:bg-purple-900/15",
		iconColor: "text-purple-400 dark:text-purple-300",
		features: [
			"Video calls available",
			"Meet & greet scheduling",
			"Compatibility assessment",
		],
	},
	{
		id: 3,
		icon: Home,
		title: "Welcome Home",
		description:
			"Complete secure adoption process and bring your new family member home safely.",
		color: "from-purple-500 to-purple-400",
		bgColor: "bg-purple-900/20 dark:bg-purple-900/20",
		iconColor: "text-purple-400 dark:text-purple-300",
		features: [
			"Digital paperwork",
			"Follow-up support",
			"Pet care resources",
		],
	},
]

export default function HowItWorks() {
	return (
		<section className="py-16 sm:py-20 bg-black">
			<Container>
				{/* Header */}
				<div className="text-center mb-12 sm:mb-16 animate-fadeInUp">
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/80 dark:bg-neutral-900/80 backdrop-blur-sm border border-purple-400/20 dark:border-purple-400/20 mb-6">
						<Sparkles className="w-4 h-4 text-purple-400 mr-2" />
						<span className="text-sm font-medium text-purple-200 dark:text-purple-200 font-inter">
							Simple Process
						</span>
					</div>

					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-purple-200 dark:text-purple-200 mb-6 leading-tight font-urbanist">
						How Adoption
						<span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block sm:inline sm:ml-3">
							Works
						</span>
					</h2>

					<p className="text-lg sm:text-xl text-purple-300 dark:text-purple-300 max-w-3xl mx-auto leading-relaxed font-inter">
						Our streamlined process makes pet adoption simple, secure, and joyful.
						<span className="font-semibold text-purple-400 dark:text-purple-400">
							{" "}
							Join thousands of happy families.
						</span>
					</p>
				</div>

				{/* Steps Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
					{steps.map((step, index) => (
						<div
							key={step.id}
							className="relative group animate-fadeInUp"
							style={{ animationDelay: `${index * 0.2}s` }}
						>
							{/* Connection Line - Desktop Only */}
							{index < steps.length - 1 && (
								<div className="hidden lg:block absolute top-16 -right-6 w-12 h-0.5 bg-gradient-to-r from-purple-400/30 to-transparent dark:from-purple-400/30 z-0">
									<ArrowRight className="absolute -right-2 -top-2 w-5 h-5 text-purple-400/50 dark:text-purple-400/50" />
								</div>
							)}

							{/* Step Card */}
							<div className="relative bg-neutral-900 dark:bg-neutral-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-400/20 dark:border-purple-400/20 group-hover:border-purple-400/30 dark:group-hover:border-purple-400/30 h-full">
								{/* Step Number */}
								<div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-400 rounded-xl flex items-center justify-center shadow-lg">
									<span className="text-white font-bold text-sm font-inter">
										{step.id}
									</span>
								</div>

								{/* Icon */}
								<div
									className={`inline-flex items-center justify-center w-16 h-16 ${step.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
								>
									<step.icon className={`w-8 h-8 ${step.iconColor}`} />
								</div>

								{/* Content */}
								<div className="space-y-4">
									<h3 className="text-xl font-semibold text-purple-200 dark:text-purple-200 group-hover:text-purple-300 dark:group-hover:text-purple-300 transition-colors duration-300 font-inter">
										{step.title}
									</h3>

									<p className="text-purple-300 dark:text-purple-300 leading-relaxed font-inter">
										{step.description}
									</p>

									{/* Features List */}
									<ul className="space-y-2">
										{step.features.map((feature, featureIndex) => (
											<li
												key={featureIndex}
												className="flex items-center text-sm text-purple-400 dark:text-purple-400 font-inter"
											>
												<Check className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
												{feature}
											</li>
										))}
									</ul>
								</div>

								{/* Hover Effect */}
								<div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
							</div>
						</div>
					))}
				</div>

				{/* Call to Action */}
				<div className="text-center animate-fadeInUp stagger-3">
					<div className="inline-flex items-center gap-4 px-8 py-4 bg-neutral-900 dark:bg-neutral-900 rounded-2xl shadow-lg border border-purple-400/20 dark:border-purple-400/20">
						<div className="flex -space-x-2">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 border-2 border-neutral-900 dark:border-neutral-900 flex items-center justify-center"
								>
									<span className="text-white text-sm font-semibold">
										👨‍👩‍👧‍👦
									</span>
								</div>
							))}
						</div>
						<div className="text-left">
							<p className="text-sm font-semibold text-purple-200 dark:text-purple-200 font-inter">
								Join 15,000+ Happy Families
							</p>
							<p className="text-xs text-purple-300 dark:text-purple-300 font-inter">
								Average adoption time: 3 days
							</p>
						</div>
					</div>
				</div>
			</Container>
		</section>
	)
}