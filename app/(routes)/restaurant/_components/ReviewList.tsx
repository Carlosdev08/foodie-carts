"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import { Rating as ReactRating } from '@smastrom/react-rating';
import moment from 'moment';

interface Review {
  publishedAt: string;
  star: number;
  userName: string;
  profileImage: string;
  reviewText: string;
}

interface ReviewListProps {
  reviewList: Review[];
}

function ReviewList({ reviewList }: ReviewListProps) {
  const [rating, setRating] = useState(0);

  return (
    <div className='flex flex-col gap-5'>
      {reviewList.length !== 0 ? reviewList.map((review, index) => (
        <div key={index} className="flex gap-5 items-center border rounded-lg p-5">
          <Image
            src={review.profileImage}
            alt={review.userName}
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <h3 className='text-sm'><span className='font-bold'>{review.userName} </span>at {moment(review.publishedAt).format('D MMM-YYYY')}</h3>
            <h2>{review.reviewText}</h2>
            <ReactRating style={{ maxWidth: 100 }} value={review.star} isDisabled={true} />
          </div>
        </div>
      )) :
        [1, 2, 3, 4].map((item, index) => (
          <div key={index} className='h-[100px] w-full bg-slate-200 animate-pulse rounded-lg'>
          </div>
        ))
      }
    </div>
  );
}

export default ReviewList;