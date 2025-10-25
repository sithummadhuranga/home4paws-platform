"use client"

import React from "react"
import { Search, Heart, Home, Check, ArrowRight, Sparkles, Users, Award, TrendingUp, Zap, Shield } from "lucide-react"
import { Container } from "@/components/common/Container"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
        statLabel: "Available Pets",
        statValue: "2,500+",
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
        statLabel: "Success Rate",
        statValue: "98%",
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
        statLabel: "Avg. Time",
        statValue: "3 Days",
    },
]

export default function HowItWorks() {
    return (
        <section className="relative py-16 sm:py-20 lg:py-28 bg-black dark:bg-black overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <Container className="relative z-10">
                {/* Header - Enhanced */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fadeInUp">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/80 dark:bg-neutral-900/80 backdrop-blur-sm border border-purple-400/30 dark:border-purple-400/30 mb-6 shadow-lg shadow-purple-500/10">
                        <Sparkles className="w-4 h-4 text-purple-400 dark:text-purple-300 mr-2 animate-pulse" />
                        <span className="text-sm font-medium text-purple-200 dark:text-purple-200 font-inter">
                            Simple Process
                        </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-purple-200 dark:text-purple-200 mb-6 leading-tight px-4 font-urbanist">
                        How Adoption
                        <span className="block sm:inline sm:ml-3 mt-2 sm:mt-0 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent animate-gradient">
                            Works
                        </span>
                    </h2>

                    <p className="text-base sm:text-lg lg:text-xl text-purple-300 dark:text-purple-300 max-w-3xl mx-auto leading-relaxed px-4 font-inter">
                        Our streamlined process makes pet adoption simple, secure, and joyful.
                        <span className="font-semibold text-purple-400 dark:text-purple-400">
                            {" "}
                            Join thousands of happy families.
                        </span>
                    </p>
                </div>

                {/* Steps Grid - Enhanced */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-16">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className="relative group animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            {/* Connection Line with Animated Pulse - Desktop Only */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-20 -right-5 w-10 z-0">
                                    <div className="relative h-0.5 bg-gradient-to-r from-purple-400/40 to-purple-400/10 dark:from-purple-400/40 dark:to-purple-400/10">
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-transparent animate-pulse opacity-50" />
                                    </div>
                                    <ArrowRight className="absolute -right-3 -top-2.5 w-6 h-6 text-purple-400/60 dark:text-purple-400/60 group-hover:text-purple-400 transition-colors duration-300 drop-shadow-lg" />
                                </div>
                            )}

                            {/* Gradient Border Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-all duration-500" />
                            
                            {/* Step Card */}
                            <div className="relative bg-neutral-900/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-purple-400/20 dark:border-purple-400/20 group-hover:border-purple-400/40 dark:group-hover:border-purple-400/40 h-full flex flex-col">
                                
                                {/* Step Number Badge - Enhanced */}
                                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 border-2 border-neutral-900 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-white font-bold font-inter">
                                        {step.id}
                                    </span>
                                </div>

                                {/* Icon Container with Enhanced Glow */}
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                                    <div
                                        className={`relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 ${step.bgColor} rounded-2xl group-hover:scale-110 transition-all duration-500 border border-purple-400/30 shadow-lg`}
                                    >
                                        <step.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${step.iconColor} group-hover:scale-110 transition-transform duration-500`} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-4 flex-grow">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-semibold text-purple-200 dark:text-purple-200 group-hover:text-purple-100 dark:group-hover:text-purple-100 transition-colors duration-300 mb-3 font-urbanist">
                                            {step.title}
                                        </h3>

                                        <p className="text-sm sm:text-base text-purple-300 dark:text-purple-300 leading-relaxed font-inter">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Features List with Staggered Animation */}
                                    <ul className="space-y-2 pt-2">
                                        {step.features.map((feature, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-center text-sm text-purple-400 dark:text-purple-400 font-inter opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1"
                                                style={{ transitionDelay: `${idx * 75}ms` }}
                                            >
                                                <div className="w-5 h-5 rounded-full bg-purple-900/30 border border-purple-400/30 flex items-center justify-center mr-2 flex-shrink-0 group-hover:bg-purple-900/50 transition-colors duration-300">
                                                    <Check className="w-3 h-3 text-purple-400" />
                                                </div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Stats Badge */}
                                <div className="mt-6 pt-4 border-t border-purple-400/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-purple-400" />
                                            <span className="text-xs text-purple-300 font-inter">{step.statLabel}</span>
                                        </div>
                                        <span className="text-lg font-bold text-purple-400 font-urbanist">{step.statValue}</span>
                                    </div>
                                </div>

                                {/* Hover Arrow Indicator */}
                                <div className="mt-4 flex items-center text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                                    <span className="text-sm font-medium font-inter mr-2">Start here</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>

                                {/* Decorative Corner Elements */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Overall Hover Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Call to Action Section */}
                <div className="relative animate-fadeInUp" style={{ animationDelay: "0.6s" }}>
                    {/* Decorative Background Glow */}
                    <div className="absolute -inset-8 bg-gradient-to-r from-purple-900/10 via-purple-800/10 to-purple-900/10 rounded-3xl blur-3xl" />
                    
                    <div className="relative bg-neutral-900/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-400/30 dark:border-purple-400/30 overflow-hidden">
                        {/* Top Accent Line */}
                        <div className="h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400" />
                        
                        <div className="p-6 sm:p-8 lg:p-10">
                            {/* Desktop Layout */}
                            <div className="hidden lg:flex items-center justify-between gap-8">
                                {/* Left Side - Avatar Group & Stats */}
                                <div className="flex items-center gap-6">
                                    {/* Avatar Stack */}
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 border-3 border-neutral-900 dark:border-neutral-900 flex items-center justify-center shadow-lg hover:scale-110 hover:z-10 transition-transform duration-300"
                                                style={{ animationDelay: `${i * 100}ms` }}
                                            >
                                                <span className="text-white text-lg">
                                                    {i === 1 ? "👨‍👩‍👧‍👦" : i === 2 ? "🐕" : i === 3 ? "🐱" : "🐰"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Text Info */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Award className="w-5 h-5 text-purple-400" />
                                            <p className="text-lg font-semibold text-purple-200 dark:text-purple-200 font-urbanist">
                                                Join 15,000+ Happy Families
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-purple-300 dark:text-purple-300 font-inter">
                                            <div className="flex items-center gap-1">
                                                <Zap className="w-4 h-4 text-yellow-400" />
                                                <span>Average adoption time: 3 days</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4 text-purple-400" />
                                                <span>98% success rate</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - CTA Button */}
                                <Link href="/adopt">
                                    <Button
                                        size="lg"
                                        className="h-14 px-10 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 text-white font-semibold shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 font-urbanist border-0 group text-lg"
                                    >
                                        Start Your Journey
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Tablet Layout */}
                            <div className="hidden md:flex lg:hidden flex-col items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 border-2 border-neutral-900 flex items-center justify-center"
                                            >
                                                <span className="text-white text-sm">
                                                    {i === 1 ? "👨‍👩‍👧‍👦" : i === 2 ? "🐕" : i === 3 ? "🐱" : "🐰"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-base font-semibold text-purple-200 font-urbanist">
                                            Join 15,000+ Happy Families
                                        </p>
                                        <p className="text-sm text-purple-300 font-inter">
                                            Average adoption time: 3 days • 98% success rate
                                        </p>
                                    </div>
                                </div>
                                <Link href="/adopt" className="w-full max-w-md">
                                    <Button
                                        size="lg"
                                        className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 text-white font-semibold shadow-lg shadow-purple-500/30 font-urbanist border-0 group"
                                    >
                                        Start Your Journey
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Mobile Layout */}
                            <div className="flex md:hidden flex-col items-center gap-4 text-center">
                                <div className="flex -space-x-2 justify-center">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 border-2 border-neutral-900 flex items-center justify-center"
                                        >
                                            <span className="text-white text-sm">
                                                {i === 1 ? "👨‍👩‍👧‍👦" : i === 2 ? "🐕" : i === 3 ? "🐱" : "🐰"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-purple-200 mb-1 font-urbanist">
                                        Join 15,000+ Happy Families
                                    </p>
                                    <p className="text-xs text-purple-300 font-inter">
                                        3-day adoption • 98% success rate
                                    </p>
                                </div>
                                <Link href="/adopt" className="w-full">
                                    <Button
                                        size="lg"
                                        className="w-full h-11 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white font-semibold shadow-lg shadow-purple-500/30 font-urbanist border-0"
                                    >
                                        Start Your Journey →
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Trust Indicators */}
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fadeInUp" style={{ animationDelay: "0.8s" }}>
                    {[
                        { icon: Shield, label: "Verified Shelters", value: "450+" },
                        { icon: Heart, label: "Happy Adoptions", value: "15K+" },
                        { icon: Award, label: "Success Rate", value: "98%" },
                        { icon: Users, label: "Active Users", value: "25K+" },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="text-center p-4 bg-neutral-900/40 backdrop-blur-sm rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105"
                        >
                            <div className="w-10 h-10 mx-auto mb-2 bg-purple-900/30 rounded-lg flex items-center justify-center border border-purple-400/30">
                                <item.icon className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="text-2xl font-bold text-purple-400 mb-1 font-urbanist">{item.value}</div>
                            <div className="text-xs text-purple-300 font-inter">{item.label}</div>
                        </div>
                    ))}
                </div>
            </Container>

            {/* Bottom Decorative Line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        </section>
    )
}