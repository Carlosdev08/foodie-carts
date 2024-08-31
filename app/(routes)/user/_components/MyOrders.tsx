"use client";

import GlobalApi from "@/app/_utils/GlobalApi";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import React, { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface OrderDetail {
  phone: string;
  restaurantName: string;
  name: string;
  price: string;
}

interface OrderProps {
  address: string;
  createdAt: string;
  email: string;
  id: string;
  orderAmount: number;
  orderDetail: OrderDetail[];
  phone: string;
  restaurantName: string;
  userName: string;
  zipCode: string;
}

interface OrdersResponse {
  orders: OrderProps[];
}

function MyOrders() {
  const { user } = useUser();
  const [orderList, setOrderList] = React.useState<OrderProps[]>([]);

  useEffect(() => {
    user && GetUserOrders();
  }, [user]);

  const GetUserOrders = () => {
    GlobalApi.GetUserOrders(user?.primaryEmailAddress?.emailAddress ?? "").then(
      (resp: any) => {
        setOrderList(resp?.orders);
        console.log(resp, "AOPI");

        console.log(resp?.orders);
        console.log(orderList, "desde");
      }
    );
  };
  return (
    <div>
      <h2 className="font-bold text-lg">My Orders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orderList &&
          orderList.map((order, index) => (
            <div
              key={index}
              className="p-3 border rounded-lg flex flex-col gap-3"
            >
              <h2 className="font-bold">
                {moment(order?.createdAt).format("DD-MMM-YYYY")}
              </h2>
              <h2 className="flex justify-between text-sm">
                Order Total Amount :<span>${order.orderAmount.toFixed(2)}</span>
              </h2>
              <h2 className="flex justify-between text-sm">
                Address :
                <span>
                  {order.address}, {order.zipCode}
                </span>
              </h2>

              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <h2 className="text-primary underline text-sm">
                      View Order Detail:
                    </h2>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-3">
                      {order.orderDetail.map((item, index) => (
                        <div className="flex justify-between">
                          <h2>{item.name} </h2>
                          <h2>${item.price}</h2>
                        </div>
                      ))}
                      <hr />
                      <h2 className="font-bold justify-between text-md mt-2">Total Order Amount (Including Taxes):<span>${order.orderAmount.toFixed(2)}</span> </h2>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MyOrders;
