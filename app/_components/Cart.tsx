import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlobalApi from "../_utils/GlobalApi";
import { toast } from "sonner";
import { CartUpdateContext } from "../_context/CartUpdateContext";
import Link from "next/link";

const Cart = ({ cart }: { cart: any }) => {
  const { updateCart, setUpdateCart } = useContext(CartUpdateContext) || {};
  const [localCart, setLocalCart] = useState(cart);  // Estado local para manejar el carrito

  useEffect(() => {
    // Actualizar el carrito local cuando el carrito de las props cambie
    setLocalCart(cart);
  }, [cart]);

  const CalculateCartAmount = () => {
    return localCart.reduce((total: number, item: any) => total + item.price, 0).toFixed(2);
  };

  const RemoveItemFromCart = (id: string) => {
    if (GlobalApi?.DisconnectRestaurantFromCartItem) {
      GlobalApi.DisconnectRestaurantFromCartItem(id)
        .then((resp) => {
          console.log('API response:', resp); // Agrega esto para depurar
          if (resp) {
            toast?.success?.("Item removed from cart");
  
            // Actualizar el carrito local después de eliminar el producto
            const updatedCart = localCart.filter((item: any) => item.id !== id);
            setLocalCart(updatedCart);
  
            // Actualizar el contexto del carrito
            if (setUpdateCart) {
              setUpdateCart(!updateCart); // Cambiar el estado booleano
            }
          } else {
            toast?.error?.("Failed to remove item from cart");
          }
        })
        .catch((error) => {
          console.error('Error removing item:', error); // Agrega esto para capturar errores
          toast?.error?.("Failed to remove item from cart");
        });
    }
  };
  
  return (
    <div>
      <h2 className="text-lg font-bold">{localCart[0]?.restaurant?.name}</h2>
      <div className="mt-5 flex flex-col gap-3">
        <h2 className="font-bold">My Order</h2>
        {localCart &&
          localCart.map((item: any, index: number) => (
            <div
              key={index}
              className="flex justify-between gap-8 items-center"
            >
              <div className="flex gap-2 items-center">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  width={40}
                  height={40}
                  className="h-[40px] w-[40px] object-cover rounded-lg"
                />
                <h2 className="text-sm">{item?.productName}</h2>
              </div>
              <h2 className="font-bold flex gap-2 items-center">
                ${item?.price}
                <X
                  className="h-4 w-4 text-red-500 cursor-pointer rounded-full"
                  onClick={() => RemoveItemFromCart(item.id)}
                />
              </h2>
            </div>
          ))}
         <Link href={'/checkout?restaurant='+(localCart[0]?.restaurant?.name || '')} className="w-full">
        <Button className='w-full mt-5'>Checkout ${CalculateCartAmount()}</Button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
