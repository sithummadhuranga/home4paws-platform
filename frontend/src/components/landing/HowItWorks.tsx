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
		color: "from-blue-500 to-blue-600",
		bgColor: "bg-blue-50 dark:bg-blue-900/20",
		iconColor: "text-blue-600 dark:text-blue-400",
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
		color: "from-green-500 to-green-600",
		bgColor: "bg-green-50 dark:bg-green-900/20",
		iconColor: "text-green-600 dark:text-green-400",
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
		color: "from-purple-500 to-purple-600",
		bgColor: "bg-purple-50 dark:bg-purple-900/20",
		iconColor: "text-purple-600 dark:text-purple-400",
		features: [
			"Digital paperwork",
			"Follow-up support",
			"Pet care resources",
		],
	},
]

export default function HowItWorks() {
	return (
		<section className="py-16 sm:py-20 bg-calm-gradient">
			<Container>
				{/* Header */}
				<div className="text-center mb-12 sm:mb-16 animate-fadeInUp">
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 mb-6">
						<Sparkles className="w-4 h-4 text-blue-600 mr-2" />
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Simple Process
						</span>
					</div>

					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
						How Adoption
						<span className="text-gradient block sm:inline sm:ml-3">Works</span>
					</h2>

					<p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
						Our streamlined process makes pet adoption simple, secure, and joyful.
						<span className="font-semibold text-blue-600 dark:text-blue-400">
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
								<div className="hidden lg:block absolute top-16 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600 z-0">
									<ArrowRight className="absolute -right-2 -top-2 w-5 h-5 text-gray-400 dark:text-gray-600" />
								</div>
							)}

							{/* Step Card */}
							<div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group-hover:border-gray-200 dark:group-hover:border-gray-600 h-full">
								{/* Step Number */}
								<div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
									<span className="text-white font-bold text-sm">
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
									<h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
										{step.title}
									</h3>

									<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
										{step.description}
									</p>

									{/* Features List */}
									<ul className="space-y-2">
										{step.features.map((feature, featureIndex) => (
											<li
												key={featureIndex}
												className="flex items-center text-sm text-gray-500 dark:text-gray-400"
											>
												<Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
												{feature}
											</li>
										))}
									</ul>
								</div>

								{/* Hover Effect */}
								<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
							</div>
						</div>
					))}
				</div>

				{/* Call to Action */}
				<div className="text-center animate-fadeInUp stagger-3">
					<div className="inline-flex items-center gap-4 px-8 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
						<div className="flex -space-x-2">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center"
								>
									<span className="text-white text-sm font-semibold">
										👨‍👩‍👧‍👦
									</span>
								</div>
							))}
						</div>
						<div className="text-left">
							<p className="text-sm font-semibold text-gray-900 dark:text-white">
								Join 15,000+ Happy Families
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Average adoption time: 3 days
							</p>
						</div>
					</div>
				</div>
			</Container>
		</section>
	)
}