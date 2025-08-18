"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Container } from "@/components/common/Container"
import { useEffect, useState } from "react"

const pets = [
	{ id: 1, name: "Luna", age: "2 years", type: "Golden Retriever", tag: "Friendly • Vaccinated • Loves Kids", img: "/vercel.svg", color: "from-yellow-400/20 to-orange-400/20" },
	{ id: 2, name: "Max", age: "1 year", type: "Persian Cat", tag: "Calm • Indoor • Gentle", img: "/next.svg", color: "from-blue-400/20 to-purple-400/20" },
	{ id: 3, name: "Bella", age: "3 years", type: "Labrador Mix", tag: "Energetic • Trained • Protective", img: "/globe.svg", color: "from-pink-400/20 to-rose-400/20" }
]

export default function Hero() {
	const [index, setIndex] = useState(0)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		const timer = setInterval(() => setIndex(i => (i + 1) % pets.length), 4000)
		return () => clearInterval(timer)
	}, [])

	if (!mounted) return null

	return (
		<section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden min-h-screen flex items-center">
			{/* Magical background */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-3xl animate-float" />
				<div className="absolute top-20 -right-32 w-64 h-64 bg-gradient-to-br from-accent/40 to-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
				<div className="absolute bottom-20 left-1/4 w-48 h-48 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '-4s' }} />
				
				{/* Floating paw prints */}
				<div className="absolute top-1/4 left-1/3 text-primary/10 animate-pawprint text-4xl">🐾</div>
				<div className="absolute top-3/4 right-1/4 text-secondary/10 animate-pawprint text-3xl" style={{ animationDelay: '-1s' }}>🐾</div>
				<div className="absolute top-1/2 left-1/6 text-accent/10 animate-pawprint text-2xl" style={{ animationDelay: '-2s' }}>🐾</div>
			</div>

			<Container className="relative grid gap-16 lg:grid-cols-2 items-center">
				<div className="relative z-10 space-y-8">
					{/* Badge */}
					<div className="inline-flex items-center gap-3 rounded-full border bg-gradient-to-r from-background/80 to-card/80 backdrop-blur-sm px-4 py-2 text-sm font-medium shadow-lg">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
							<span className="text-emerald-600 dark:text-emerald-400 font-semibold">Live</span>
						</div>
						<span className="text-muted-foreground">1,247 successful adoptions this month</span>
					</div>

					{/* Main headline */}
					<div className="space-y-4">
						<h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
							Every pet deserves a{" "}
							<span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
								loving home
							</span>
						</h1>
						<p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
							Connect hearts with paws. Discover adoptable companions, find trusted pet products, and join a community dedicated to animal welfare.
						</p>
					</div>

					{/* Search form */}
					<div className="relative">
						<form className="flex flex-col sm:flex-row gap-4 p-6 rounded-3xl border bg-gradient-to-r from-card/80 to-background/80 backdrop-blur-sm shadow-2xl shadow-primary/10">
							<div className="flex-1 relative">
								<input
									className="w-full h-14 px-6 rounded-2xl border-2 border-transparent bg-background/50 backdrop-blur-sm text-base placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/20 transition-all"
									placeholder="Search by breed, age, location... (e.g. Golden Retriever, 1-3 years, Colombo)"
									aria-label="Search pets"
								/>
								<div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50">
									🔍
								</div>
							</div>
							<Button size="lg" className="h-14 px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300">
								Find My Match
							</Button>
						</form>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
						{[
							{ label: "Verified Shelters", value: "320+", icon: "🏠" },
							{ label: "Happy Adoptions", value: "5.7K", icon: "❤️" },
							{ label: "Avg. Match Time", value: "3 days", icon: "⚡" },
							{ label: "Community Rating", value: "4.9/5", icon: "⭐" }
						].map(stat => (
							<div key={stat.label} className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border">
								<div className="text-2xl mb-2">{stat.icon}</div>
								<div className="font-bold text-xl text-primary">{stat.value}</div>
								<div className="text-sm text-muted-foreground">{stat.label}</div>
							</div>
						))}
					</div>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4">
						<Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-xl hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300">
							<Link href="/pets" className="flex items-center gap-2">
								<span>🐕</span> Browse Pets
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg" className="h-14 px-8 border-2 hover:bg-accent/10 transition-all duration-300">
							<Link href="/pets/new" className="flex items-center gap-2">
								<span>📝</span> List a Pet
							</Link>
						</Button>
						<Button asChild variant="ghost" size="lg" className="h-14 px-8 hover:bg-secondary/10 transition-all duration-300">
							<Link href="/marketplace" className="flex items-center gap-2">
								<span>🛍️</span> Shop
							</Link>
						</Button>
					</div>
				</div>

				{/* Pet showcase */}
				<div className="relative z-10">
					<div className="relative mx-auto w-full max-w-md">
						{/* Main pet card */}
						<div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-primary/20 bg-gradient-to-br from-card via-background to-card">
							<div className={`aspect-[4/5] bg-gradient-to-br ${pets[index].color} relative overflow-hidden`}>
								<Image
									src={pets[index].img}
									alt={pets[index].name}
									fill
									className="object-contain p-8 transition-all duration-700 animate-float"
								/>
								
								{/* Overlay content */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
								<div className="absolute bottom-0 left-0 right-0 p-6 text-white">
									<div className="flex items-center justify-between mb-2">
										<div>
											<h3 className="text-2xl font-bold">{pets[index].name}</h3>
											<p className="text-white/80">{pets[index].age} • {pets[index].type}</p>
										</div>
										<div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
											#{String(pets[index].id).padStart(3, "0")}
										</div>
									</div>
									<p className="text-sm text-white/90 mb-4">{pets[index].tag}</p>
									<div className="flex gap-2">
										<Button size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30">
											View Profile
										</Button>
										<Button size="sm" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
											❤️ Save
										</Button>
									</div>
								</div>
							</div>
						</div>

						{/* Floating elements */}
						<div className="absolute -top-4 -left-4 bg-gradient-to-br from-emerald-400 to-emerald-500 text-white p-4 rounded-2xl shadow-xl animate-float">
							<div className="text-center">
								<div className="text-2xl font-bold">24/7</div>
								<div className="text-xs">Support</div>
							</div>
						</div>

						<div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-primary to-secondary text-white p-4 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '-1s' }}>
							<div className="text-center">
								<div className="text-2xl">🛡️</div>
								<div className="text-xs font-semibold">Safe & Secure</div>
							</div>
						</div>

						<div className="absolute top-1/2 -left-8 hidden lg:block">
							<div className="bg-card/80 backdrop-blur-sm border rounded-2xl p-4 shadow-lg">
								<div className="text-sm font-semibold mb-2">🔥 Trending</div>
								<div className="space-y-2 text-xs">
									<div className="flex justify-between"><span>Golden Retriever</span><span className="text-emerald-500">+12</span></div>
									<div className="flex justify-between"><span>Persian Cat</span><span className="text-emerald-500">+8</span></div>
									<div className="flex justify-between"><span>Beagle</span><span className="text-emerald-500">+5</span></div>
								</div>
							</div>
						</div>

						{/* Pagination dots */}
						<div className="flex justify-center gap-2 mt-6">
							{pets.map((_, i) => (
								<button
									key={i}
									onClick={() => setIndex(i)}
									className={`w-3 h-3 rounded-full transition-all ${i === index ? 'bg-primary scale-125' : 'bg-muted-foreground/30'}`}
								/>
							))}
						</div>
					</div>
				</div>
			</Container>
		</section>
	)
}