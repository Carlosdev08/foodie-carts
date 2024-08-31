
"use client";

import React, {use, useEffect, useState}  from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Rating as ReactRating } from '@smastrom/react-rating'
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import GlobalApi from '@/app/_utils/GlobalApi';
import { toast } from 'sonner';
import ReviewList from './ReviewList';




interface IntroProps {
    restaurant: {
      slug: string;
    };
  }
  
  type Review = {
    publishedAt: string;
    email: string;
    profileImage: string;
    userName: string;
    star: number;
    reviewText: string;
    RetroSlug: string;
  };
  
  
  const ReviewSection = ({ restaurant }: IntroProps) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState<string>('');
    const [reviewList, setReviewList] = useState<Review[]>([]);  
    const { user } = useUser();
  
    useEffect(() => {
        getReviewList();
    }, [restaurant]);
  
    const handleSubmit = () => {
        if (!reviewText) {
            toast.error('Review text cannot be empty');
            return;
          }
        const data: Review = {
          email: user?.primaryEmailAddress?.emailAddress || '',
          profileImage: user?.imageUrl || '',
          userName: user?.fullName || '',
          star: rating,
          reviewText: reviewText,
          RetroSlug: restaurant.slug,
          publishedAt: ''
        };
        console.log('Data to be sent:', data); // Log para depuración
        GlobalApi.AddNewReview(data).then((resp: any) => {
          console.log('Review Added:', resp);
          toast.success('Review Added Successfully');
          resp&&getReviewList();
        });
    };
    console.log('Review text before submit:', reviewText); // Log para depuración

  
    const getReviewList = () => {
        GlobalApi.getRestaurantReviews(restaurant.slug).then((resp: any) => {
            console.log('Review List:', resp);

          resp&&setReviewList(resp.reviews);
        });
    };
  
  
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 mt-10 gap-10'>
        <div className='flex flex-col gap-2 p-3 rounded-lg border shadow-lg'>
          <h2 className='font-bold text-lg'>Add your review</h2>
          <ReactRating style={{ maxWidth: 100 }} value={rating} onChange={setRating} />
          <Textarea
  value={reviewText}
  onChange={(e) => {
    setReviewText(e.target.value);
    console.log('Current review text:', e.target.value); // Agregar log para depuración
  }}
/>
          <Button disabled={rating == 0 || !reviewText} 
          onClick={handleSubmit}>
            Submit
          </Button>
        </div>
        <div className='col-span-2'>
            <ReviewList reviewList={reviewList} />
        </div>
      </div>
    );
  };
  
  export default ReviewSection;