"use client"

import * as React from "react"
import { BadgeCheck, ArrowRight } from "lucide-react"
import NumberFlow from "@number-flow/react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/LandingPage/ui/badge"
import { Card } from "@/components/LandingPage/ui/card"

export interface PricingTier {
  name: string
  price: Record<string, number | string>
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
  popular?: boolean
}

interface PricingCardProps {
  tier: PricingTier
  paymentFrequency: string
}

export function PricingCard({ tier, paymentFrequency }: PricingCardProps) {
  const price = tier.price[paymentFrequency]
  const isHighlighted = tier.highlighted
  const isPopular = tier.popular

  return (
    <Card
      className={cn(
        "relative flex flex-col gap-8 overflow-hidden p-6 border-[0.5px] border-gray-300",
        isHighlighted
          ? "bg-foreground text-background border-gray-600"
          : "bg-background text-foreground",
        isPopular && "ring-1 ring-gray-400"
      )}
    >
      {isHighlighted && <HighlightedBackground />}
      {isPopular && <PopularBackground />}

      <div className="relative z-10 flex flex-col gap-8 h-full">
        <h2 className="flex items-center gap-3 text-xl sm:text-2xl font-semibold capitalize">
          {tier.name}
          {isPopular && (
            <Badge variant="secondary" className="mt-1 bg-gray-900 text-white hover:bg-gray-800 text-xs">
              🔥 Most Popular
            </Badge>
          )}
        </h2>

        <div className="relative h-12 sm:h-16">
          {typeof price === "number" ? (
            <>
              <NumberFlow
                format={{
                  style: "currency",
                  currency: "EUR",
                  trailingZeroDisplay: "stripIfInteger",
                }}
                value={price}
                className="text-2xl sm:text-4xl font-semibold"
              />
              <p className="-mt-1 sm:-mt-2 text-xs sm:text-sm text-muted-foreground">
                Per month
              </p>
            </>
          ) : (
            <h1 className="text-2xl sm:text-4xl font-semibold">{price}</h1>
          )}
        </div>

        <div className="flex-1 space-y-3 sm:space-y-4">
          <h3 className="text-sm sm:text-base font-medium">{tier.description}</h3>
          <ul className="space-y-2 sm:space-y-3">
            {tier.features.map((feature, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-center gap-2 text-sm sm:text-base font-medium",
                  isHighlighted ? "text-background" : "text-muted-foreground"
                )}
              >
                <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <button 
          className={cn(
            "inline-flex items-center justify-center w-full px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg relative z-20",
            isHighlighted 
              ? "bg-white text-gray-900 hover:bg-gray-100" 
              : "bg-gray-900 text-white hover:bg-gray-800"
          )}
        >
          {tier.cta}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </Card>
  )
}

const HighlightedBackground = () => (
  <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
)

const PopularBackground = () => (
  <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,0,0,0.05),rgba(255,255,255,0))]" />
)