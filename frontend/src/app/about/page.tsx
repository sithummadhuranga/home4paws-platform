import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Award, Users, Clock, Star, ArrowRight, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Container } from "@/components/common/Container"

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-24 lg:py-28 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 via-transparent to-transparent" />
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-400/8 rounded-full blur-3xl animate-pulse" />

          <Container>
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/80 backdrop-blur-sm border border-purple-400/20 mb-6 animate-fadeInUp">
                <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-sm font-medium text-purple-200 font-inter">Our Story</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-purple-200 mb-6 leading-tight font-urbanist animate-fadeInUp stagger-1">
                Making Pet Adoption 
                <span className="block bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent mt-2">
                  Simple & Joyful
                </span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-purple-300 max-w-3xl mx-auto leading-relaxed mb-8 font-inter animate-fadeInUp stagger-2">
                We're on a mission to create more loving homes for pets in need and build a community that celebrates the joy of pet parenthood.
              </p>

              <div className="flex flex-wrap justify-center gap-4 animate-fadeInUp stagger-3">
                <Link href="/adopt">
                  <Button 
                    size="lg" 
                    className="h-14 text-lg px-8 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Start Adopting
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="h-14 text-lg px-8 border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Mission & Values Section */}
        <section className="py-16 sm:py-20 bg-neutral-900">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 animate-fadeInUp">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-4">
                  <Heart className="w-3.5 h-3.5 text-purple-400 mr-2" />
                  <span className="text-xs font-medium text-purple-200 font-inter">Our Mission</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-purple-200 mb-6 leading-tight font-urbanist">
                  Creating Forever Bonds Between 
                  <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block mt-1">
                    Pets & People
                  </span>
                </h2>

                <p className="text-base sm:text-lg text-purple-300 mb-6 leading-relaxed font-inter">
                  Home4Paws was founded with a simple yet powerful vision: to transform the pet adoption experience and help more animals find loving homes. We believe that every pet deserves a family, and every family deserves the perfect pet companion.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    "Streamlining the adoption process",
                    "Creating lasting connections",
                    "Supporting animal welfare organizations",
                    "Educating future pet parents"
                  ].map((value, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mt-1 mr-3 p-1 bg-purple-900/30 rounded-full">
                        <Check className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-purple-200 font-medium font-inter">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link href="/shelters">
                    <Button 
                      className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-purple-500/20"
                    >
                      Meet Our Partner Shelters
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="order-1 lg:order-2 animate-fadeInUp relative">
                <div className="relative z-10 aspect-square max-w-md mx-auto overflow-hidden rounded-3xl border-2 border-purple-400/20">
                  <Image 
                    src="https://images.unsplash.com/photo-1601758174039-617983b8cdd9?w=800&h=800&fit=crop" 
                    alt="Happy pet parent with adopted dog" 
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Floating stats */}
                <div className="absolute -bottom-6 -left-6 w-36 p-4 bg-neutral-900 rounded-xl border border-purple-400/20 shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-5 h-5 text-purple-400" />
                    <p className="font-bold text-xl text-purple-200 font-urbanist">15,000+</p>
                  </div>
                  <p className="text-sm text-purple-300 font-inter">Successful Adoptions</p>
                </div>
                
                <div className="absolute -top-6 -right-6 w-36 p-4 bg-neutral-900 rounded-xl border border-purple-400/20 shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-purple-300" />
                    <p className="font-bold text-xl text-purple-200 font-urbanist">450+</p>
                  </div>
                  <p className="text-sm text-purple-300 font-inter">Partner Shelters</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Our Story Section */}
        <section className="py-16 sm:py-20 bg-black">
          <Container>
            <div className="text-center mb-12 animate-fadeInUp">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-4">
                <Clock className="w-3.5 h-3.5 text-purple-300 mr-2" />
                <span className="text-xs font-medium text-purple-200 font-inter">Our Journey</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-purple-200 mb-6 leading-tight font-urbanist">
                The Home4Paws
                <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block sm:inline sm:ml-3">
                  Story
                </span>
              </h2>

              <p className="text-base sm:text-lg text-purple-300 max-w-3xl mx-auto leading-relaxed font-inter">
                From a small idea to a thriving community of pet lovers – our journey to revolutionize pet adoption.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 sm:left-1/2 sm:-ml-0.5 w-1 h-full bg-purple-900/50" />
              
              {/* Timeline Items */}
              <div className="space-y-12">
                {[
                  {
                    year: "2020",
                    title: "The Beginning",
                    description: "Home4Paws was founded by a group of animal lovers who saw the need for a better, more accessible pet adoption platform.",
                    image: "https://images.unsplash.com/photo-1589965716319-4a041b58fa8a?w=600&h=400&fit=crop"
                  },
                  {
                    year: "2021",
                    title: "First 1,000 Adoptions",
                    description: "We celebrated our first milestone of 1,000 successful pet adoptions and expanded our partner network to 100 shelters.",
                    image: "https://images.unsplash.com/photo-1604848698030-c434ba08ece1?w=600&h=400&fit=crop"
                  },
                  {
                    year: "2022",
                    title: "Launching the Marketplace",
                    description: "We introduced our pet supplies marketplace to provide everything new pet parents need for their furry friends.",
                    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop"
                  },
                  {
                    year: "2023",
                    title: "Going Nationwide",
                    description: "Home4Paws expanded across the country, now partnering with over 450 shelters and having facilitated 15,000+ adoptions.",
                    image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600&h=400&fit=crop"
                  }
                ].map((item, index) => (
                  <div key={index} className={`relative flex flex-col sm:flex-row items-start gap-8 ${index % 2 !== 0 ? 'sm:flex-row-reverse' : ''}`}>
                    {/* Content */}
                    <div className={`relative z-10 sm:w-1/2 pt-2 ${index % 2 !== 0 ? 'sm:text-right' : ''} animate-fadeInUp`} style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-4 ${index % 2 !== 0 ? 'sm:ml-auto' : ''}`}>
                        <span className="text-sm font-bold text-purple-200 font-inter">{item.year}</span>
                      </div>

                      <h3 className="text-xl font-semibold text-purple-200 mb-2 font-urbanist">{item.title}</h3>
                      <p className="text-purple-300 leading-relaxed font-inter">{item.description}</p>
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute left-0 sm:left-1/2 transform sm:-translate-x-1/2 w-8 h-8 bg-purple-500 rounded-full border-4 border-neutral-900 z-20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-200 rounded-full" />
                    </div>

                    {/* Image */}
                    <div className={`relative z-10 ml-12 sm:ml-0 sm:w-1/2 animate-fadeInUp`} style={{ animationDelay: `${index * 0.1 + 0.1}s` }}>
                      <div className="aspect-video overflow-hidden rounded-xl border border-purple-400/20 shadow-lg">
                        <Image 
                          src={item.image} 
                          alt={item.title}
                          width={600}
                          height={400} 
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Team Section */}
        <section className="py-16 sm:py-20 bg-neutral-900">
          <Container>
            <div className="text-center mb-12 animate-fadeInUp">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-4">
                <Users className="w-3.5 h-3.5 text-purple-400 mr-2" />
                <span className="text-xs font-medium text-purple-200 font-inter">Our Team</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-purple-200 mb-6 leading-tight font-urbanist">
                Meet the Passionate People
                <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block sm:inline sm:ml-3">
                  Behind Home4Paws
                </span>
              </h2>

              <p className="text-base sm:text-lg text-purple-300 max-w-3xl mx-auto leading-relaxed mb-8 font-inter">
                Our diverse team of animal lovers, tech experts, and industry professionals are united by one mission: connecting pets with loving homes.
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  name: "Alexandra Chen",
                  role: "Founder & CEO",
                  bio: "Former shelter volunteer with a passion for creating tech solutions for animal welfare.",
                  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
                },
                {
                  name: "Marcus Rodriguez",
                  role: "Head of Shelter Relations",
                  bio: "10+ years experience in animal rescue and nonprofit management.",
                  image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
                },
                {
                  name: "Emily Johnson",
                  role: "Chief Veterinary Officer",
                  bio: "Specialized in shelter medicine with a focus on animal behavior and wellness.",
                  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
                },
                {
                  name: "David Kim",
                  role: "Product Lead",
                  bio: "Tech innovator dedicated to creating intuitive platforms that connect people and pets.",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                }
              ].map((member, index) => (
                <div 
                  key={index} 
                  className="bg-neutral-800 rounded-2xl p-5 border border-purple-400/20 group hover:border-purple-400/40 transition-all duration-300 animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-square overflow-hidden rounded-xl mb-4 relative">
                    <Image 
                      src={member.image} 
                      alt={member.name}
                      width={400}
                      height={400} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-neutral-900/60 border-purple-400/30">
                          <Users className="w-4 h-4 text-purple-300" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-purple-200 mb-1 font-urbanist">{member.name}</h3>
                  <p className="text-sm text-purple-400 mb-2 font-inter">{member.role}</p>
                  <p className="text-sm text-purple-300 font-inter">{member.bio}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/careers">
                <Button
                  variant="outline" 
                  className="border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                >
                  Join Our Team
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 sm:py-20 bg-black">
          <Container>
            <div className="text-center mb-12 animate-fadeInUp">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-4">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-current mr-2" />
                <span className="text-xs font-medium text-purple-200 font-inter">Success Stories</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-purple-200 mb-6 leading-tight font-urbanist">
                What Pet Parents
                <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block sm:inline sm:ml-3">
                  Say About Us
                </span>
              </h2>

              <p className="text-base sm:text-lg text-purple-300 max-w-3xl mx-auto leading-relaxed font-inter">
                Real stories from families who found their perfect companions through our platform.
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  name: "Sarah Chen",
                  location: "San Francisco, CA",
                  text: "Home4Paws made adopting Luna incredibly smooth. The staff was amazing, and the whole process took just 3 days from first contact to bringing her home!",
                  image: "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=80&h=80&fit=crop&crop=face",
                  pet: "Luna, Golden Retriever",
                  rating: 5
                },
                {
                  name: "James Wilson",
                  location: "Austin, TX",
                  text: "After months of searching for the right cat, I found Oliver through Home4Paws. Their matching system is incredible - he fits perfectly with my lifestyle!",
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
                  pet: "Oliver, Maine Coon",
                  rating: 5
                },
                {
                  name: "Emily Johnson",
                  location: "Seattle, WA",
                  text: "Adopted two rescue bunnies through Home4Paws. The support team guided us through everything, and now Milo and Zoe are thriving in their forever home!",
                  image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
                  pet: "Milo & Zoe, Holland Lop Bunnies",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <blockquote className="text-lg text-purple-200 leading-relaxed mb-6 font-medium font-inter">
                    "{testimonial.text}"
                  </blockquote>

                  <div className="flex items-center">
                    <div className="relative mr-4">
                      <Image 
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 rounded-full border-2 border-neutral-900 flex items-center justify-center">
                        <Heart className="w-2.5 h-2.5 text-white fill-current" />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-purple-200 text-base font-inter">
                        {testimonial.name}
                      </h4>
                      <div className="flex flex-col">
                        <span className="text-xs text-purple-300 font-inter">
                          {testimonial.location}
                        </span>
                        <span className="text-xs text-purple-400 font-medium font-inter">
                          Adopted: {testimonial.pet}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center animate-fadeInUp">
              <Link href="/stories">
                <Button
                  className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-purple-500/20"
                >
                  Read More Success Stories
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-neutral-900 to-black">
          <Container>
            <div className="text-center mb-12 animate-fadeInUp">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-4">
                <Award className="w-3.5 h-3.5 text-purple-400 mr-2" />
                <span className="text-xs font-medium text-purple-200 font-inter">Our Impact</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-purple-200 mb-6 leading-tight font-urbanist">
                Making a
                <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block sm:inline sm:ml-3">
                  Difference
                </span>
              </h2>

              <p className="text-base sm:text-lg text-purple-300 max-w-3xl mx-auto leading-relaxed font-inter">
                Every adoption is a life changed. Here's how our community is creating a better world for pets and people.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  icon: Heart,
                  number: "15,000+",
                  label: "Successful Adoptions",
                  color: "text-purple-400"
                },
                {
                  icon: Users,
                  number: "450+",
                  label: "Partner Shelters",
                  color: "text-purple-300"
                },
                {
                  icon: Award,
                  number: "98%",
                  label: "Success Rate",
                  color: "text-purple-400"
                },
                {
                  icon: Clock,
                  number: "3 Days",
                  label: "Average Adoption Time",
                  color: "text-purple-300"
                }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-neutral-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 text-center animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-purple-900/30 rounded-2xl flex items-center justify-center border border-purple-400/30">
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-semibold text-purple-200 mb-1 font-urbanist">{stat.number}</div>
                  <p className="text-sm text-purple-300 font-medium font-inter">{stat.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-20 bg-black">
          <Container>
            <div className="text-center mb-12 animate-fadeInUp">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-400/20 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 mr-2" />
                <span className="text-xs font-medium text-purple-200 font-inter">FAQs</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-purple-200 mb-6 leading-tight font-urbanist">
                Frequently Asked
                <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block sm:inline sm:ml-3">
                  Questions
                </span>
              </h2>

              <p className="text-base sm:text-lg text-purple-300 max-w-3xl mx-auto leading-relaxed font-inter">
                Everything you need to know about Home4Paws and our mission to connect pets with loving families.
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  question: "How does the pet adoption process work?",
                  answer: "Our adoption process is designed to be simple and effective. Browse available pets, submit an application for your chosen pet, get approved by the shelter, schedule a meet-and-greet, and finalize the adoption. The entire process typically takes 3-5 days."
                },
                {
                  question: "Are all shelters on Home4Paws verified?",
                  answer: "Yes, we thoroughly vet all shelter partners to ensure they meet our standards for animal care, ethical practices, and adoption procedures. We only partner with licensed and reputable animal welfare organizations."
                },
                {
                  question: "How does Home4Paws make money?",
                  answer: "Home4Paws operates on a sustainable business model that includes revenue from our pet marketplace, optional premium features for adopters, and partnership programs. The basic adoption platform is always free for shelters and adopters."
                },
                {
                  question: "Can I volunteer or work with Home4Paws?",
                  answer: "Absolutely! We're always looking for passionate individuals to join our team, either as employees or volunteers. Check out our Careers page for current openings or contact us directly to discuss volunteer opportunities."
                },
                {
                  question: "How can shelters partner with Home4Paws?",
                  answer: "Shelters can apply to become a partner through our Shelter Portal. Our team will review your application and guide you through the onboarding process. We provide free training and ongoing support to all our shelter partners."
                }
              ].map((faq, index) => (
                <div 
                  key={index}
                  className="bg-neutral-900/40 backdrop-blur-sm rounded-xl border border-purple-400/20 overflow-hidden animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer">
                      <h3 className="text-lg font-medium text-purple-200 font-urbanist">{faq.question}</h3>
                      <div className="w-5 h-5 border-2 border-purple-400/70 rounded-full flex items-center justify-center group-open:bg-purple-500 group-open:border-purple-500 transition-colors duration-200">
                        <span className="block w-2.5 h-0.5 bg-purple-300 group-open:bg-white transition-colors duration-200"></span>
                        <span className="block w-0.5 h-2.5 bg-purple-300 group-open:bg-white absolute transition-colors duration-200 group-open:opacity-0"></span>
                      </div>
                    </summary>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-purple-300 font-inter">{faq.answer}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center animate-fadeInUp">
              <p className="text-base text-purple-300 mb-4 font-inter">Still have questions? We're here to help!</p>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28 bg-black">
          <Container>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-neutral-900 to-purple-900/20 border border-purple-400/20">
              {/* Background Elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
              
              <div className="relative p-8 sm:p-12 md:p-16 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-purple-200 mb-6 leading-tight font-urbanist animate-fadeInUp">
                  Ready to Find Your
                  <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent block sm:inline sm:ml-3">
                    Perfect Pet?
                  </span>
                </h2>

                <p className="text-base sm:text-lg text-purple-300 max-w-2xl mx-auto mb-8 font-inter animate-fadeInUp stagger-1">
                  Join thousands of happy families who've found their forever companions through Home4Paws.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp stagger-2">
                  <Link href="/adopt">
                    <Button 
                      size="lg" 
                      className="h-14 text-lg px-8 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 rounded-[32px] text-white font-inter font-medium shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Start Your Search
                    </Button>
                  </Link>

                  <Link href="/shelters">
                    <Button 
                      variant="outline"
                      size="lg" 
                      className="h-14 text-lg px-8 border-2 border-purple-400/50 bg-neutral-900/40 backdrop-blur-sm text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 rounded-[32px] font-inter font-medium transition-all duration-300"
                    >
                      Find Shelters Near You
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}