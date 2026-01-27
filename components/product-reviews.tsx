'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import reviews from '@/data/reviews.json'
import { Review } from '@/types/index'

interface UserReview extends Review {
  productId: number;
}

interface ProductReviewsProps {
  productId: number;
  totalCount?: number;
  averageRating?: number;
}

export function ProductReviews({ productId, totalCount, averageRating }: ProductReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 0,
    text: ''
  });
  
  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
    const productUserReviews = savedReviews.filter((review: UserReview) => review.productId === productId);
    setUserReviews(productUserReviews);
  }, [productId]);
  
  const reviewData = reviews.find(r => r.productId === productId);
  const jsonReviews = reviewData?.reviews || [];
  const allReviews = [...jsonReviews, ...userReviews];
  
  // Сортируем отзывы по дате (новые сверху)
  const productReviews = allReviews.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // убывающий порядок (новые сверху)
  });
  
  const displayTotalCount = totalCount || productReviews.length || 0;
  const displayAverageRating = averageRating || reviewData?.averageRating || 0;
  
  const visibleReviews = showAll ? productReviews : productReviews.slice(0, 3);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reviewToAdd = {
      id: Date.now(),
      userName: newReview.userName,
      rating: newReview.rating,
      text: newReview.text,
      date: new Date().toISOString()
    };
    
    // Сохраняем отзыв в localStorage
    const existingReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
    const updatedReviews = [...existingReviews, { ...reviewToAdd, productId }];
    localStorage.setItem('userReviews', JSON.stringify(updatedReviews));
    
    // Обновляем состояние компонента
    setUserReviews(prev => [...prev, reviewToAdd]);
    
    // Сбрасываем форму и закрываем диалог
    setNewReview({ userName: '', rating: 0, text: '' });
    setShowReviewForm(false);
  }

  const handleStarClick = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Отзывы</h2>
        <div className="text-sm text-gray-600">
          <span className="mr-4">{displayTotalCount} отзывов</span>
          <span>Средняя оценка: {displayAverageRating}</span>
        </div>
      </div>
      



      {productReviews.length > 0 ? (
        <div className="space-y-4">
          {visibleReviews.map((review: Review) => (
            <Card key={review.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{review.userName}</span>
                    <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <Separator />
                <p className="text-sm text-muted-foreground">{review.text}</p>
              </CardContent>
            </Card>
          ))}
          {productReviews.length > 3 && (
            <div className="flex justify-between items-center mt-4">
              <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                <DialogTrigger asChild>
                  <Button className="px-8">
                    Написать отзыв
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Написать отзыв</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Ваше имя"
                        value={newReview.userName}
                        onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-6 w-6 cursor-pointer ${index < newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          onClick={() => handleStarClick(index + 1)}
                        />
                      ))}
                    </div>
                    <div>
                      <Textarea
                        placeholder="Ваш отзыв"
                        value={newReview.text}
                        onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Отправить отзыв
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Скрыть' : 'Смотреть все'}
              </Button>
            </div>
          )}
          {productReviews.length <= 3 && (
             <div className="flex justify-start mt-4">
               <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                 <DialogTrigger asChild>
                   <Button className="px-8">
                     Написать отзыв
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-[425px]">
                   <DialogHeader>
                     <DialogTitle>Написать отзыв</DialogTitle>
                   </DialogHeader>
                   <form onSubmit={handleSubmitReview} className="space-y-4">
                     <div>
                       <Input
                         placeholder="Ваше имя"
                         value={newReview.userName}
                         onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                         required
                       />
                     </div>
                     <div className="flex items-center gap-1">
                       {Array.from({ length: 5 }).map((_, index) => (
                         <Star
                           key={index}
                           className={`h-6 w-6 cursor-pointer ${index < newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                           onClick={() => handleStarClick(index + 1)}
                         />
                       ))}
                     </div>
                     <div>
                       <Textarea
                         placeholder="Ваш отзыв"
                         value={newReview.text}
                         onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                         required
                       />
                     </div>
                     <Button type="submit" className="w-full">
                       Отправить отзыв
                     </Button>
                   </form>
                 </DialogContent>
               </Dialog>
             </div>
           )}
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 text-center text-muted-foreground">
              Пока нет отзывов для этого товара
            </CardContent>
          </Card>
          <div className="flex justify-start">
             <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
               <DialogTrigger asChild>
                 <Button className="px-8">
                   Написать отзыв
                 </Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px]">
                 <DialogHeader>
                   <DialogTitle>Написать отзыв</DialogTitle>
                 </DialogHeader>
                 <form onSubmit={handleSubmitReview} className="space-y-4">
                   <div>
                     <Input
                       placeholder="Ваше имя"
                       value={newReview.userName}
                       onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                       required
                     />
                   </div>
                   <div className="flex items-center gap-1">
                     {Array.from({ length: 5 }).map((_, index) => (
                       <Star
                         key={index}
                         className={`h-6 w-6 cursor-pointer ${index < newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                         onClick={() => handleStarClick(index + 1)}
                       />
                     ))}
                   </div>
                   <div>
                     <Textarea
                       placeholder="Ваш отзыв"
                       value={newReview.text}
                       onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                       required
                     />
                   </div>
                   <Button type="submit" className="w-full">
                     Отправить отзыв
                   </Button>
                 </form>
               </DialogContent>
             </Dialog>
           </div>
        </div>
      )}
    </div>
  )
}