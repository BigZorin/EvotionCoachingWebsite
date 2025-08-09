"use client"

import Image from "next/image"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils" // Utility for conditionally joining class names

interface TransformationDetailSectionProps {
  name: string
  image: string
  fullStory: string
  achievements: string[]
  quote: string
  focusAreas: string[]
  isReversed?: boolean
}

export function TransformationDetailSection({
  name,
  image,
  fullStory,
  achievements,
  quote,
  focusAreas,
  isReversed = false,
}: TransformationDetailSectionProps) {
  return (
    <section
      className={cn(
        "w-full py-16 md:py-28 lg:py-36 bg-white",
        isReversed ? "bg-gray-50" : "bg-white", // Alternate background for visual separation
      )}
    >
      <div
        className={cn(
          "container px-4 md:px-6 max-w-7xl mx-auto grid gap-12 lg:gap-20 items-center",
          isReversed ? "lg:grid-cols-[1fr_1.2fr]" : "lg:grid-cols-[1.2fr_1fr]", // Alternate grid order
        )}
      >
        <div
          className={cn(
            "relative w-full h-[400px] md:h-[550px] lg:h-[650px] overflow-hidden rounded-3xl shadow-2xl",
            isReversed ? "lg:order-2 animate-fade-in-right" : "lg:order-1 animate-fade-in-left",
          )}
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={`Transformatie van ${name}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div
          className={cn(
            "space-y-8",
            isReversed ? "lg:order-1 animate-fade-in-left" : "lg:order-2 animate-fade-in-right",
          )}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-evotion-primary leading-tight animate-fade-in-up">
            {name}: Jouw Succesverhaal
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed animate-fade-in-up delay-100">{fullStory}</p>

          <div className="bg-evotion-primary/5 border-l-4 border-evotion-primary p-6 rounded-lg shadow-md animate-fade-in-up delay-200">
            <p className="text-2xl italic font-semibold text-evotion-primary leading-snug">
              <Sparkles className="inline-block w-6 h-6 mr-2 text-evotion-primary" />
              {quote}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 animate-fade-in-up delay-300">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Behaalde Resultaten</h3>
              <ul className="space-y-2 text-lg text-gray-700 list-disc list-inside">
                {achievements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Focusgebieden</h3>
              <ul className="space-y-2 text-lg text-gray-700 list-disc list-inside">
                {focusAreas.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
