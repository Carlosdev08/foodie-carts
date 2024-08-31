import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Business {
  reviews: any;
  categories: any;
  restroType: any;
  banner?: {
    url: string;
    
  };
  name: string;
  slug: string
}

function BusinessItem({ business }: { business: Business }) {

  const calculateRating = () => {
    let totalReviews = 0;
    let count = 0;
    
    
    business?.reviews?.forEach((item: { star: number; }) =>{
        let total = 0;
        let count = 0;
        total= total + item.star;
        count++;
    })
    

    const result = totalReviews /count;
    return result ? (result.toFixed(1)) : "4.5";
  };
  return (
    <Link href={'/restaurant/'+ business?.slug} className=" p-3 hover:border rounded-xl hover:border-primary cursor-pointer hover:bg-orange-50">
      <Image
        src={business.banner?.url ?? ""}
        alt={business?.name}
        width={500}
        height={130}
        className="h-[130px] rounded-xl object-cover"
      />
      <div className="mt-2">
        <h2 className="font-bold text-lg flex justify-between">
          {business.name}
        </h2>
        <div className="flex justify-between  items-center">
          <div className="flex gap-2 items-center">
            <Image src="/start.png" alt="start" width={14} height={14} />
            <label className="text-gray-400 text-sm">{calculateRating()} </label>
            <h2 className="text-gray-400 text-sm">
              {business?.restroType[0].name}{" "}
            </h2>
          </div>
          <h2 className="text-sm text-primary">{business.categories[0].name}</h2>
        </div>

        <div></div>
      </div>
    </Link>
  );
}

export default BusinessItem;
