"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Filter, Heart } from "lucide-react"
import { useState } from "react"

const stats = [
    { number: "50K+", label: "Happy Adoptions" },
    { number: "1,200+", label: "Verified Shelters" },
    { number: "98%", label: "Success Rate" },
    { number: "24/7", label: "Support" }
]

export default function Hero() {
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                Over 1,000 pets adopted this month
                            </div>
                            
                            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                                Find your perfect{" "}
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    companion
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                                Connect with loving pets in need of homes. Browse verified shelters, 
                                find your perfect match, and join a community of pet lovers.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        placeholder="Search by breed, age, or name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="lg" className="px-4 dark:border-gray-600 dark:hover:bg-gray-700">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Location
                                    </Button>
                                    <Button variant="outline" size="lg" className="px-4 dark:border-gray-600 dark:hover:bg-gray-700">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Filters
                                    </Button>
                                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8">
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/pets">
                                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                                    Browse Pets
                                </Button>
                            </Link>
                            <Link href="/rehome">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-medium border-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 dark:border-gray-600">
                                    Rehome a Pet
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Hero Image */}
                    <div className="relative">
                        <div className="relative z-10">
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border dark:border-gray-700">
                                <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                                    <Image
                                        src="/next.svg"
                                        alt="Happy pets waiting for adoption"
                                        fill
                                        className="object-contain p-8"
                                        priority
                                    />
                                </div>
                                
                                {/* Pet Card Overlay */}
                                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Luna</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Golden Retriever • 2 years</p>
                                        </div>
                                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                                            <Heart className="w-4 h-4 mr-1" />
                                            Adopt
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-4 -left-4 w-20 h-20 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center animate-float">
                            <span className="text-2xl">🐕</span>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-pink-100 dark:bg-pink-900/50 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '-2s' }}>
                            <span className="text-xl">🐱</span>
                        </div>
                        <div className="absolute top-1/2 -right-8 w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '-4s' }}>
                            <span className="text-lg">🐰</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}