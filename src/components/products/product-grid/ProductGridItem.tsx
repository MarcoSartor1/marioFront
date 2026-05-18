'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';

import type { CartProduct, Product, ProductVariant } from '@/interfaces';
import { useCartStore, useNavigationStore } from '@/store';

interface Props {
  product: Product;
}

export const ProductGridItem = ({ product }: Props) => {
  const addProductToCart = useCartStore(state => state.addProductTocart);
  const startLoading = useNavigationStore(state => state.startLoading);

  const [displayImage, setDisplayImage] = useState(product.images[0]);
  const [posted, setPosted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const variants = product.variants ?? [];
  const hasSizes = product.sizes.length > 0;
  const hasVariants = variants.length > 0;

  const isAvailable = hasVariants
    ? variants.some(v => v.inStock > 0)
    : (product.inStock ?? 0) > 0;

  const getImageSrc = (img: string | undefined) => {
    if (!img) return '/imgs/placeholder.jpg';
    return img.startsWith('http') ? img : `/products/${img}`;
  };

  const addToCart = () => {
    setPosted(true);
    if (hasSizes) return;
    if (hasVariants && !selectedVariant) return;

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: 1,
      size: undefined!,
      color: selectedVariant?.color,
      variantId: selectedVariant?.id,
      image: product.images[0],
    };

    addProductToCart(cartProduct);
    setPosted(false);
    setSelectedVariant(null);
  };

  return (
    <div className="rounded-xl overflow-hidden fade-in bg-white border border-amber-100/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      <Link
        href={`/product/${product.slug}`}
        onClick={startLoading}
        className="relative w-full aspect-square overflow-hidden flex-shrink-0"
        style={{ maxHeight: '240px' }}
      >
        <Image
          src={getImageSrc(displayImage)}
          alt={product.title}
          fill
          className="object-contain transition-opacity duration-300"
          onMouseEnter={() => product.images[1] && setDisplayImage(product.images[1])}
          onMouseLeave={() => setDisplayImage(product.images[0])}
        />
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <Link
          className="hover:text-primary text-sm font-medium line-clamp-2 uppercase"
          onClick={startLoading}
          href={`/product/${product.slug}`}
        >
          {product.title}
        </Link>

        {product.price === 0
          ? <span className="text-sm text-gray-400 italic">Consultar precio</span>
          : <span className="font-bold text-lg">${product.price.toLocaleString('es-AR')}</span>
        }

        {/* Selector de color inline */}
        {hasVariants && (
          <div className="flex flex-wrap gap-1.5">
            {variants.map(v => (
              <button
                key={v.id}
                title={v.inStock === 0 ? `${v.color} — sin stock` : v.color}
                disabled={v.inStock === 0}
                onClick={() => setSelectedVariant(prev => prev?.id === v.id ? null : v)}
                className={clsx(
                  'px-2 py-0.5 rounded text-xs border transition-all',
                  v.inStock === 0
                    ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                    : selectedVariant?.id === v.id
                      ? 'border-primary bg-amber-50 text-primary font-semibold'
                      : 'border-gray-300 text-gray-600 hover:border-primary'
                )}
              >
                {v.color}
                {v.inStock > 0 && (
                  <span className={clsx(
                    'ml-1',
                    selectedVariant?.id === v.id ? 'text-primary' : 'text-gray-400'
                  )}>
                    ({v.inStock})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {posted && hasSizes && (
          <span className="text-xs text-red-500 fade-in">Seleccioná una talla en el producto</span>
        )}
        {posted && hasVariants && !selectedVariant && (
          <span className="text-xs text-red-500 fade-in">Seleccioná un color</span>
        )}

        <button
          onClick={addToCart}
          disabled={!isAvailable}
          className="mt-auto w-full bg-primary hover:opacity-90 text-white text-sm font-semibold py-2 rounded-lg transition-all disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          {isAvailable ? 'Agregar al carrito' : 'Sin stock'}
        </button>
      </div>
    </div>
  );
};