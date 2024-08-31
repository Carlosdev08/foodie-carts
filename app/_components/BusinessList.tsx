"use client"
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import GlobalApi from "../_utils/GlobalApi";
import BusinessItem from './BusinessItem';
import BusinessItemSkeleton from './BusinessItemSkeleton';

function BusinessList() {
    
    const params=useSearchParams();
    const [category, setCategory] = useState<string[]>([])
    const [businessList, seBusinessList]= useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() =>{
      const categoy = params.get('category')
      params && categoy && setCategory([categoy]);
        params&&GetBusinessList(params.get('category'))
    },[params])

    const GetBusinessList =(category:any) => {
      setLoading(true)
      GlobalApi.GetBusiness(category).then((resp: any)=>{
       
        seBusinessList(resp?.restaurants)
        setLoading(false)
      })
    }
  return (
    <div className='mt-5'>

      <h2 className='font-medium text-2xl'>Popular {category} Restaurants</h2>
      <h2 className='font-bold text-primary'>{businessList?.length} Results</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-3'>
        {!loading? businessList.map((restaurants,index)=>(
          <BusinessItem  key={index} business={restaurants}/>
        )): [1,2,3,4,5,6,7,8].map((item, index)=>(
          <BusinessItemSkeleton key={index}/>
        ))}
      </div>
    </div>
  )
}

export default BusinessList