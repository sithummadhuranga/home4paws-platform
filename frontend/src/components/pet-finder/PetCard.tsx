'use client'

import Image from "next/image"
import { StatusBadge } from "./StatusBadge"
import { useRouter } from "next/navigation"
import { MapPin, Calendar, Search } from "lucide-react"

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
      className="overflow-hidden rounded-2xl border-2 border-purple-400/20 bg-neutral-900/60 backdrop-blur-sm hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-48 w-full bg-neutral-800">
        <Image
          src={photo}
          alt={`${type} - ${breed}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={false}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={75}
        />
        <div className="absolute top-2 right-2">
          <StatusBadge status={status} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-purple-200 font-urbanist">{name}</h3>
        <p className="text-sm text-purple-300 mb-3 font-inter">{type} - {breed}</p>

        <div className="space-y-1 text-sm text-purple-300 font-inter">
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-400" />
            {location}
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            {date}
          </p>
          {status === 'lost' && lastSeen && (
            <p className="flex items-center gap-2 text-red-400">
              <Search className="w-4 h-4" />
              Last seen: {lastSeen}
            </p>
          )}
          {status === 'found' && foundArea && (
            <p className="flex items-center gap-2 text-green-400">
              <MapPin className="w-4 h-4" />
              Found at: {foundArea}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}