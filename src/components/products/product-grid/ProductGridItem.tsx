'use client';

import Image from 'next/image';
import Link from 'next/link';

import { CartProduct, Product } from '@/interfaces';
import { useCartStore, useNavigationStore } from '@/store';
import { useState } from 'react';

interface Props {
  product: Product;
}


export const ProductGridItem = ( { product }: Props ) => {

  const addProductToCart = useCartStore( state => state.addProductTocart );
  const startLoading = useNavigationStore( state => state.startLoading );
  const [ displayImage, setDisplayImage ] = useState( product.images[ 0 ] );
  const [ posted, setPosted ] = useState( false );

  const hasSizes = product.sizes.length > 0;

  const getImageSrc = (img: string | undefined) => {
    if ( !img ) return '/imgs/placeholder.jpg';
    return img.startsWith('http') ? img : `/products/${img}`;
  };

  const addToCart = () => {
    setPosted( true );
    if ( hasSizes ) return;

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: 1,
      size: undefined!,
      image: product.images[0],
    };

    addProductToCart( cartProduct );
    setPosted( false );
  };

  return (
    <div className="rounded-md overflow-hidden fade-in border border-gray-200 shadow-sm flex flex-col h-full">
      <Link href={ `/product/${ product.slug }` } onClick={ startLoading } className="relative w-full aspect-square overflow-hidden flex-shrink-0" style={{ maxHeight: '240px' }}>
        <Image
          src={ getImageSrc(displayImage) }
          alt={ product.title }
          fill
          className="object-contain transition-opacity duration-300"
          onMouseEnter={ () => product.images[1] && setDisplayImage( product.images[1] ) }
          onMouseLeave={ () => setDisplayImage( product.images[0] ) }
        />
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <Link
          className="hover:text-blue-600 text-sm font-medium line-clamp-2"
          onClick={ startLoading }
          href={ `/product/${ product.slug }` }>
          { product.title }
        </Link>
        <span className="font-bold text-lg">${ product.price }</span>
        <p className="text-xs text-gray-500">Stock: { product.inStock ?? 0 }</p>

        { posted && hasSizes && (
          <span className="text-xs text-red-500 fade-in">
            Seleccioná una talla en el producto
          </span>
        ) }

        <button
          onClick={ addToCart }
          disabled={ !product.inStock }
          className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
        >
          { product.inStock ? 'Agregar al carrito' : 'Sin stock' }
        </button>
      </div>

    </div>
  );
};