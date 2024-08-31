"use client";

import React, { useEffect, useRef, useState } from "react";
import GlobalApi from "../_utils/GlobalApi";
import Image from "next/image";
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import BusinessList from './BusinessList';


const categoryList = () => {
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
 const params=useSearchParams();
 const [selectedCategory, setSelectedCategory]= useState<string[]>(['All'])

useEffect(()=> {
  const categoy = params.get('category')
  setSelectedCategory(categoy?[categoy]: ['All']);
},[params])


  useEffect(() => {
    getCategoryList();
  }, []);

  /**
   * Used to get CategoryList
   */
  const getCategoryList = () => {
    GlobalApi.GetCategory().then((resp: any) => {
      setCategoryList(resp.categories);
    });
  };
  const ScrollRightHandler = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="mt-10 relative">
        <div className="flex gap-4 overflow-auto scrollbar-hide" ref={listRef}>
          {categoryList &&
            categoryList?.map((category, index) => (
              <Link
              href={'?category='+ category.slug}
                key={index}
                className={`flex flex-col justify-center items-center gap-2 border p-3 rounded-xl min-w-28 hover:border-primary hover:bg-orange-50 cursor-pointer group
                  ${selectedCategory===category.slug&&'text-primary border-primary bg-orange-50  shadow-md'}
                  `}
              >
                <Image
                  src={category.icon?.url}
                  alt={category.name}
                  width={50}
                  height={50}
                  placeholder = 'empty'
                  quality={75} 
                  className="group-hover:scale-125 transition-all duration-200"
                />
                <div>
                  <h2 className="text-sm font-medium">{category.name}</h2>
                </div>
              </Link>
            ))}
        </div>
        <ArrowRightCircle
          className="absolute -right-9 top-9 bg-gray-500 rounded-full text-white w-8 h-8 cursor-pointer"
          onClick={() => ScrollRightHandler()}
        />
      </div>
    </>
  );
};

export default categoryList;
