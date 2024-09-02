"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useParams } from 'next/navigation';
import GlobalApi from '@/app/_utils/GlobalApi';
import Intro from '../_components/Intro';
import Tabs from '../_components/Tabs';


// Define the common interface for Banner
interface Banner {
  url: string;
  description?: string;
  productImage?: string;
}

// Define the interface for Restaurant
interface Restaurant {
  slug: string;
  name: string;
  banner: Banner;
  address: string;
  menu: string;
  reviews: { star: number }[];
}

function RestaurantDetail() {
  const pathname = usePathname();
  const [restaurant, setRestaurant] = useState<Restaurant>({
    slug: '',
    name: '',
    banner: {
      url: '',
      description: '',
      productImage: ''
    },
    address: '',
    menu: '',
    reviews: []
  });

  useEffect(() => {
    const restroSlug = pathname.split("/")[2];
    getBusinessDetail(restroSlug);
  }, [pathname]);

  const getBusinessDetail = (restroSlug: string) => {
    GlobalApi.GetBusinessDetail(restroSlug).then((resp: any) => {
      if (resp && resp.restaurant) {
        setRestaurant(resp.restaurant);
      }
    }).catch(err => console.error("Failed to fetch restaurant details:", err));
  };

  return (
    <div>
      <Intro restaurant={restaurant} />
      <Tabs restaurant={restaurant} />
    </div>
  );
}

export default RestaurantDetail;
