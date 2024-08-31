"use client";

import { UserButton, UserProfile } from "@clerk/nextjs";
import { DotIcon, ShoppingBag } from "lucide-react";
import React from "react";
import MyOrders from "./_components/MyOrders";

function User() {
  return (
    <div className="flex justify-center items-center">
      <UserProfile routing="hash">
        <UserButton.UserProfilePage
          label="My Orders"
          labelIcon={<ShoppingBag  className="w-5 h-5"/>}
          url="my-orders"
        >
          <MyOrders />
        </UserButton.UserProfilePage>
        
      </UserProfile>
    </div>
  );
}

export default User;