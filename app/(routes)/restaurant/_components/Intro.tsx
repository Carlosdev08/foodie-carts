"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

type IntroProps = {
    restaurant: {
        reviews: { star: number }[];
        address: string;
        name: string;
        banner: {
            url: string;
        };
    };
};

function Intro({ restaurant }: IntroProps) {
    const [totalReview, setTotalReview] = useState(0);
    const [avrRating, setAvrRating] = useState(0);

    useEffect(() => {
        if (restaurant) {
            calculateRating();
        }
    }, [restaurant]);

    const calculateRating = () => {
        let totalReviews = 0;
        let count = 0;

        restaurant?.reviews?.forEach((item) => {
            totalReviews += item.star;
            count++;
        });

        setTotalReview(count);

        const result = count > 0 ? totalReviews / count : 0;
        setAvrRating(result ? parseFloat(result.toFixed(1)) : 4.5);
    };

    return (
        <div>
            {restaurant?.banner?.url ? (
                <div>
                    <Image
                        src={restaurant?.banner?.url}
                        width={1000}
                        height={300}
                        alt="banner"
                        className="w-full h-[220px] object-cover rounded-xl"
                    />
                </div>
            ) : (
                <div className="h-[220px] w-full bg-slate-200 animate-pulse rounded-xl"></div>
            )}
            <h2 className="text-3xl font-bold mt-4">{restaurant?.name}</h2>
            <div className="flex items-center gap-2 mt-2">
                <Image src={'/start.png'} width={20} height={20} alt="start" />
                <label className="text-sm text-gray-500">
                    {avrRating}({totalReview})
                </label>
            </div>
            <h2 className="text-gray-500 mt-2 flex gap-2 items-center">
                <MapPin />
                {restaurant?.address}
            </h2>
        </div>
    );
}

export default Intro;