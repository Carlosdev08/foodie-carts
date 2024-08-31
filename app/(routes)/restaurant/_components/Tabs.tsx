import React from 'react'
import { Tabs as UITabs, TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs"
import MenuSection from './MenuSection'
import ReviewSection from './ReviewSection';

// Reutilizar la interfaz Banner
interface Banner {
  url: string;
  description?: string;
  productImage?: string;
}

// Modificar la interfaz IntroProps para usar Banner
type IntroProps = {
  restaurant: {
    slug: string;
    menu: any;
    address: string;
    name: string;
    banner: Banner;
  };
};

function ComponenstTabs({ restaurant }: IntroProps) {
  return (
    <Tabs defaultValue="category" className="w-full mt-10">
      <TabsList>
        <TabsTrigger value="category">Category</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="category">
        <MenuSection 
          restaurant={restaurant} 
          description={restaurant?.banner.description || ''} 
          name={restaurant.name} 
          productImage={restaurant.banner.productImage || ''} 
          url={restaurant.banner.url} 
          slug={restaurant.slug}
        />
      </TabsContent>      
      <TabsContent value="about">About</TabsContent>
      <TabsContent value="reviews">
        <ReviewSection restaurant={restaurant} />
      </TabsContent>
    </Tabs>
  )
}

export default ComponenstTabs;
