"use client";

import React, { useContext, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CartUpdateContext } from "../_context/CartUpdateContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Cart from "./Cart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface CartResponse {
  userCarts: string[] | null;
}

const Header = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const { updateCart, setUpdateCart } = useContext(CartUpdateContext) || {};
  const [cart, setCart] = useState<string[]>([]);

  const GetUserCart = useCallback(async () => {
    const response: CartResponse = (await GlobalApi.GetUserCart(
      user?.primaryEmailAddress?.emailAddress ?? ""
    )) as CartResponse;
    setCart(response?.userCarts || []);
  }, [user]);

  useEffect(() => {
    if (user) {
      GetUserCart();
    }
  }, [user, updateCart, GetUserCart]);

  return (
    <div className="flex justify-between items-center p-4 md:px-10 shadow-sm cursor-pointer">
      <div>
        <Link href={'/'}>
          <Image
            src="/logoheader.png"
            alt="foodie Cart"
            width={200}
            height={200}
            className="p-4 min-w-6"
          />
        </Link>
      </div>

      <div className=" md:flex border p-2 rounded-lg bg-gray-100 w-96">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent w-full outline-none"
        />
        <Search className="flex justify-center items-center m-2 rounded-xl text-primary" />
      </div>

      {isSignedIn ? (
        <div className="flex gap-3 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex gap-2 items-center">
                <ShoppingCart />
                <label className="p-1 px-3 rounded-full bg-slate-200">
                  {cart?.length}
                </label>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-full">
              <Cart cart={cart} />
            </PopoverContent>
          </Popover>
          {/* <UserButton /> */}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Image
                src={user?.imageUrl}
                alt="user"
                width={35}
                height={35}
                className="rounded-full cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={"/user"}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <Link href={"/user#/my-orders"}>
                <DropdownMenuItem>My Orders</DropdownMenuItem>
              </Link>
              <SignInButton>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </SignInButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex gap-5">
          <SignInButton mode="modal">
            <Button variant={"outline"}>Login</Button>
          </SignInButton>
          <SignUpButton>
            <Button>SignUp</Button>
          </SignUpButton>
        </div>
      )}
    </div>
  );
};

export default Header;