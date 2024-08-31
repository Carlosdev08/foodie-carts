import { createContext } from "react";
import React from "react";

interface CartUpdateContextType {
  updateCart: any; 
  setUpdateCart: React.Dispatch<React.SetStateAction<any>>; 
}

export const CartUpdateContext = React.createContext<CartUpdateContextType | null>(null);