"use client";

import { useState } from "react";

import { ColorSelector, QuantitySelector, SizeSelector } from "@/components";
import type { ColorOption } from "@/components/product/color-selector/ColorSelector";
import type { CartProduct, Product } from "@/interfaces";
import { useCartStore } from '@/store';

interface Props {
  product: Product;
}

function parseColor(colorStr: string): { name: string; hex: string } {
  const idx = colorStr.lastIndexOf(':');
  if (idx !== -1 && colorStr[idx + 1] === '#') {
    return { name: colorStr.slice(0, idx), hex: colorStr.slice(idx + 1) };
  }
  return { name: colorStr, hex: '#cccccc' };
}

export const AddToCart = ({ product }: Props) => {

  const addProductToCart = useCartStore(state => state.addProductTocart);

  const [size, setSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<ColorOption | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState(false);

  const hasSizes = product.sizes.length > 0;
  const hasVariants = (product.variants ?? []).length > 0;
  const hasPlainColors = !hasVariants && (product.colors ?? []).length > 0;
  const requiresColor = hasVariants || hasPlainColors;

  const colorOptions: ColorOption[] = hasVariants
    ? (product.variants ?? []).map(v => {
        const match = (product.colors ?? []).find(c =>
          parseColor(c).name.toLowerCase() === v.color.toLowerCase()
        );
        return {
          id: v.id,
          label: v.color,
          hex: match ? parseColor(match).hex : '#cccccc',
          disabled: v.inStock === 0,
        };
      })
    : (product.colors ?? []).map(colorStr => {
        const { name, hex } = parseColor(colorStr);
        return { label: name, hex };
      });

  const selectedId = selectedColor?.id ?? selectedColor?.label;

  const addToCart = () => {
    setPosted(true);

    if (hasSizes && !size) return;
    if (requiresColor && !selectedColor) return;

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      color: selectedColor?.label,
      variantId: selectedColor?.id,
      image: product.images[0],
    };

    addProductToCart(cartProduct);
    setPosted(false);
    setQuantity(1);
    setSize(undefined);
    setSelectedColor(undefined);
  };

  const isOutOfStock = hasVariants
    ? (product.variants ?? []).every(v => v.inStock === 0)
    : !hasPlainColors && product.inStock === 0;

  return (
    <>
      {posted && hasSizes && !size && (
        <span className="mt-2 text-red-500 fade-in">
          Debe de seleccionar una talla*
        </span>
      )}

      {posted && requiresColor && !selectedColor && (
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
      {colorOptions.length > 0 && (
        <ColorSelector
          selectedId={selectedId}
          options={colorOptions}
          onColorChanged={setSelectedColor}
        />
      )}

      {/* Selector de Cantidad */}
      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

      {/* Button */}
      {isOutOfStock ? (
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
