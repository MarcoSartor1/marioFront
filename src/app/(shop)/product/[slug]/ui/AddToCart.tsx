"use client";

import { useState } from "react";

import { ColorSelector, QuantitySelector, SizeSelector } from "@/components";
import type { CartProduct, Product } from "@/interfaces";
import { useCartStore } from '@/store';

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {

  const addProductToCart = useCartStore( state => state.addProductTocart );

  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState(false);

  const hasSizes = product.sizes.length > 0;
  const hasColors = (product.colors ?? []).length > 0;

  const addToCart = () => {
    setPosted(true);

    if (hasSizes && !size) return;
    if (hasColors && !color) return;

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      color: color,
      image: product.images[0]
    }

    addProductToCart(cartProduct);
    setPosted(false);
    setQuantity(1);
    setSize(undefined);
    setColor(undefined);
  };


  return (
    <>
      {posted && hasSizes && !size && (
        <span className="mt-2 text-red-500 fade-in">
          Debe de seleccionar una talla*
        </span>
      )}

      {posted && hasColors && !color && (
        <span className="mt-2 text-red-500 fade-in">
          Debe de seleccionar un color*
        </span>
      )}

      {/* Selector de Tallas */}
      {hasSizes && (
        <SizeSelector
          selectedSize={size}
          availableSizes={product.sizes}
          onSizeChanged={setSize}
        />
      )}

      {/* Selector de Colores */}
      {hasColors && (
        <ColorSelector
          selectedColor={color}
          availableColors={product.colors}
          onColorChanged={setColor}
        />
      )}

      {/* Selector de Cantidad */}
      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

      {/* Button */}
      {product.inStock === 0 ? (
        <button disabled className="btn-primary my-5 opacity-50 cursor-not-allowed">
          Sin stock
        </button>
      ) : (
        <button onClick={addToCart} className="btn-primary my-5">
          Agregar al carrito
        </button>
      )}
    </>
  );
};
