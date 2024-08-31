"use client";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { CartUpdateContext } from "@/app/_context/CartUpdateContext";
import { Button } from "@/components/ui/button";
import Cart from "../../_components/Cart";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { PayPalButtons } from "@paypal/react-paypal-js";

interface CartItem {
  productName: string;
  id: string;
  name: string;
  price: number;
}

interface CartResponse {
  userCarts: CartItem[] | null;
}



function Checkout({ } ) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useUser();
  const [subTotal, setSubTotal] = useState(0);
  const { updateCart, setUpdateCart } = useContext(CartUpdateContext) || {};
  const [deliveryAmount, setDeliveryAmount] = useState(5);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.log(params.get("restaurant"));
    user && GetUserCart();
  }, [user, updateCart]);

  const GetUserCart = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) {
        console.error("User email is required to fetch the cart.");
        return;
      }

      const response = await GlobalApi.GetUserCart(
        user.primaryEmailAddress.emailAddress
      );

      const cartResponse = response as CartResponse;

      setCart(cartResponse.userCarts || []);

      calculeTotalAmount(cartResponse.userCarts || []);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      toast.error("Failed to fetch cart data");
    }
  };

  const calculeTotalAmount = (cart_: any[]) => {
    let total = 0;
    cart_.forEach((item) => {
      total += parseFloat(item.price);
    });
    const subTotal = parseFloat(total.toFixed(2));
    setSubTotal(subTotal);

    const taxAmount = parseFloat(((subTotal * 9) / 100).toFixed(2));
    setTaxAmount(taxAmount);

    const totalAmount = parseFloat(
      (subTotal + deliveryAmount + taxAmount).toFixed(2)
    );
    setTotalAmount(totalAmount);
  };

  const addToOrder = (): Promise<void> => {
    setLoading(true);
    const data = {
      email: user?.primaryEmailAddress?.emailAddress ?? "",
      orderAmount: totalAmount,
      restaurantName: params.get("restaurant") ?? "", // Provide a default value
      phone: phone ?? "", // Provide a default value
      address: address ?? "", // Provide a default value
      userName: username ?? "", // Provide a default value
      zipCode: zip ?? "", // Provide a default value
    };

    return GlobalApi.CreateNewOrder(data).then(
      (resp: any) => {
        const resultId = resp?.createOrder.id;
        if (resultId) {
          const promises = cart?.map((item) =>
            GlobalApi.UpdateOrderToAddOrderItems(
              item.productName,
              item.price,
              resultId,
              user?.primaryEmailAddress?.emailAddress ?? "" // Provide a default value
            )
          );

          return Promise.all(promises)
            .then((results) => {
              console.log(resultId);
              setLoading(false);
              toast("Order created successfully");
              if (setUpdateCart) {
                setUpdateCart(!updateCart);
                SentEmail(user?.primaryEmailAddress?.emailAddress ?? "");
                router.replace("/confirmation");
              }
            })
            .catch((error) => {
              console.error("Error in UpdateOrderToAddOrderItems:", error);
              setLoading(false);
            });
        } else {
          setLoading(false);
          return Promise.reject("No resultId found");
        }
      },
      (error) => {
        console.error("Error in CreateNewOrder:", error);
        setLoading(false);
        return Promise.reject(error);
      }
    );
  };

  const SentEmail = async (email: string) => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user?.primaryEmailAddress?.emailAddress }),
      });
      if (!response.ok) {
        throw new Error("Failed to send email");
      }
    } catch (err) {
      console.error("Error in sending email:", err);
      toast("Failed to send email");
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl my-5">Checkout</h2>
      <div className="p-5 px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 mx-20">
          <h2 className="font-bold text-3xl">Billing Details</h2>
          <div className="grid grid-cols-2 gap-10 mt-3">
            <Input
              placeholder="Name"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-10 mt-3">
            <Input
              placeholder="Phone"
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              placeholder="Zip"
              onChange={(e) => setZip(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <Input
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="mx-10 border">
          <h2 className="p-3 bg-gray-200 font-bold text-center">
            Total Cart ({cart?.length})
          </h2>
          <div className="p-4 flex flex-col gap-4">
            <h2 className="font-bold flex justify-between">
              Subtotal <span>${subTotal}</span>
            </h2>
            <hr />
            <h2 className="flex justify-between">
              Delivery <span>${deliveryAmount}</span>
            </h2>
            <hr />
            <h2 className="flex justify-between">
              Tax (9%) <span>${taxAmount.toFixed(2)}</span>
            </h2>
            <hr />
            <h2 className="font-bold flex justify-between">
              Total <span>${totalAmount.toFixed(2)}</span>
            </h2>
            {totalAmount > 5 && (
              <PayPalButtons
                disabled={
                  username && email && phone && zip && address
                    ? false
                    : true || loading
                }
                style={{ layout: "horizontal" }}
                onApprove={addToOrder}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: totalAmount.toFixed(2),
                          currency_code: "USD",
                        },
                      },
                    ],
                    intent: "CAPTURE",
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;