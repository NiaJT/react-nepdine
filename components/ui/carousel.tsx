"use client"

import * as React from "react"
import useEmblaCarousel, { type EmblaOptionsType } from "embla-carousel-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type CarouselProps = {
  opts?: EmblaOptionsType
  orientation?: "horizontal" | "vertical"
  className?: string
  children?: React.ReactNode
}

const CarouselContext = React.createContext<{
  emblaRef: (node: HTMLElement | null) => void
  scrollPrev: () => void
  scrollNext: () => void
} | null>(null)

export function Carousel({
  opts,
  orientation = "horizontal",
  className,
  children,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...opts,
    axis: orientation === "horizontal" ? "x" : "y",
  })

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <CarouselContext.Provider value={{ emblaRef, scrollPrev, scrollNext }}>
      <div className={cn("relative", className)}>
        <div
          ref={emblaRef}
          className={cn(
            "overflow-hidden",
            orientation === "vertical" && "flex-col"
          )}
        >
          {children}
        </div>
      </div>
    </CarouselContext.Provider>
  )
}

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex", className)}
    {...props}
  />
))
CarouselContent.displayName = "CarouselContent"

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    aria-roledescription="slide"
    className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

export function CarouselPrevious({ className, ...props }: React.ComponentProps<typeof Button>) {
  const context = React.useContext(CarouselContext)
  if (!context) throw new Error("CarouselPrevious must be used within Carousel")
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute left-0 top-1/2 -translate-y-1/2 z-10",
        className
      )}
      onClick={context.scrollPrev}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  )
}

export function CarouselNext({ className, ...props }: React.ComponentProps<typeof Button>) {
  const context = React.useContext(CarouselContext)
  if (!context) throw new Error("CarouselNext must be used within Carousel")
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute right-0 top-1/2 -translate-y-1/2 z-10",
        className
      )}
      onClick={context.scrollNext}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  )
}
