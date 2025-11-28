'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { Product } from '@/types/index'

interface ProductCarouselProps {
  products: Product[]
  title: string
}

export function ProductCarousel({ products, title }: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return

    const scrollAmount = 300
    const currentScroll = carouselRef.current.scrollLeft
    const newScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount

    carouselRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      
      <div className="relative group">
        <div 
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar"
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className="flex-none w-[250px] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon" 
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}