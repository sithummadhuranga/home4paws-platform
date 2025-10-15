'use client'

import Image from "next/image"
import { StatusBadge } from "./StatusBadge"
import { useRouter } from "next/navigation"

interface PetCardProps {
  id: number
  photo: string
  status: 'lost' | 'found'
  type: string
  breed: string
  location: string
  date: string
  name: string
  age: string
  gender: string
  lastSeen?: string
  foundArea?: string
}

export function PetCard({ 
  id,
  photo, 
  status, 
  type, 
  breed, 
  location, 
  date,
  name,
  age,
  gender,
  lastSeen,
  foundArea
}: PetCardProps) {
  const router = useRouter()
  return (
    <div 
      onClick={() => router.push(`/pet-finder/card-info/${id}`)}
      className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
        <Image
          src={photo}
          alt={`${type} - ${breed}`}
          fill
          className="object-cover"
          priority={false}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={75}
        />
        <div className="absolute top-2 right-2">
          <StatusBadge status={status} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">{name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{type} - {breed}</p>
        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {location}
          </p>
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {date}
          </p>
          {status === 'lost' && lastSeen && (
            <p className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Last seen: {lastSeen}
            </p>
          )}
          {status === 'found' && foundArea && (
            <p className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Found at: {foundArea}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
