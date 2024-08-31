"use client";

import GlobalApi from "@/app/_utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { SquarePlus } from "lucide-react";
import Image from "next/image";
import { Toaster, toast } from "sonner";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { CartUpdateContext } from "@/app/_context/CartUpdateContext";

// Reutilizar la interfaz Banner
interface Banner {
  url: string;
  description?: string;
  productImage?: string;
}

// Definir la interfaz Restaurant
interface Restaurant {
  slug: string;
  menu: MenuItem[];
  address: string;
  name: string;
  banner: Banner;
}

// Definir la interfaz MenuItem
interface MenuItem {
  [x: string]: any;
  menuItem: any[];
  category: string;
  name: string;
  description: string;
  price: string;
  productImage: {
    url: string;
  };
}

// Usar solo un parámetro en MenuProps que es de tipo Restaurant
type MenuProps = {
  restaurant: Restaurant;
  description: string;
  name: string;
  productImage: string;
  url: string;
  slug: string;
};

const MenuSection = ({ restaurant }: MenuProps) => {
  const [menuItemList, setMenuItemList] = useState<MenuItem | null>(null);
  const { user } = useUser();

  const { updateCart, setUpdateCart } = useContext(CartUpdateContext) || {};

  const FilterMenu = useCallback(
    ({ category }: { category: string }) => {
      const result = restaurant?.menu?.filter(
        (item) => item.category === category
      );
      setMenuItemList(result[0]);
      console.log("FilterMenu", result);
    },
    [restaurant]
  );

  useEffect(() => {
    restaurant?.menu && FilterMenu({ category: restaurant?.menu[0]?.category });
  }, [restaurant, FilterMenu]);

  const addToCartHandler = (item: MenuItem) => {
    toast("Adding To Cart");
    const data = {
      email: user?.primaryEmailAddress?.emailAddress,
      name: item?.name,
      description: item?.description,
      productImage: item?.productImage?.url,
      price: item?.price,
      restaurantSlug: restaurant.slug, // Obtener el slug directamente del objeto restaurant
    };

    GlobalApi.AddToCart({ data }).then(
      (data) => {
        if (setUpdateCart) {
          setUpdateCart(!updateCart);
        }
        toast("Added To Cart");
      },
      (error) => {
        toast("Error While adding into the cart");
      }
    );
  };

  return (
    <div>
      <div className="grid grid-cols-4 mt-2">
        <div className="hidden md:flex flex-col mr-10 gap-2">
          {Array.isArray(restaurant.menu) &&
            restaurant.menu.map((item, index) => (
              <Button
                variant="ghost"
                key={index}
                className="flex justify-start"
                onClick={() => FilterMenu({ category: item.category })}
              >
                {item.category}
              </Button>
            ))}
        </div>
        <div className="md:col-span-3 col-span-4">          
          <h2 className="font-extrabold text-lg ">{menuItemList?.category}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
            {menuItemList?.menuItem &&
              menuItemList?.menuItem.map((item, index) => (
                <div
                  key={index}
                  className="p-2 flex gap-2 border rounded-xl hover:border-primary items-center"
                 >
                  <Image
                    src={item?.productImage?.url}
                    alt={item?.name}
                    width={200}
                    height={200}
                    className="object-cover w-[120px] h-[120px] rounded-xl "
                  />
                  <div className="flex flex-col gap-1">
                    <h2 className="font-bold">{item?.name}</h2>

                    <h2>
                      {" "}
                      <b className="text-green-800">$</b>
                      {item.price}
                    </h2>
                    <h2 className="text-gray-400 line-clamp-2">
                      {item.description}
                    </h2>
                    <SquarePlus
                      className="cursor-pointer"
                      onClick={() => addToCartHandler(item)}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSection;
