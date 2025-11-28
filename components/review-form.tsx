'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/use-auth'

interface ReviewFormProps {
  productId: number
  onSubmit: (review: {
    rating: number
    text: string
    productId: number
  }) => void
}

export function ReviewForm({ productId, onSubmit }: ReviewFormProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    onSubmit({
      rating,
      text,
      productId
    })

    setRating(0)
    setText('')
  }

  if (!user) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Войдите, чтобы оставить отзыв
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className="p-0 hover:scale-110 transition-transform"
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(value)}
          >
            <Star
              className={`h-6 w-6 ${value <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Напишите ваш отзыв..."
        className="min-h-[100px]"
      />

      <Button
        type="submit"
        disabled={rating === 0}
        className="w-full"
      >
        Отправить отзыв
      </Button>
    </form>
  )
}