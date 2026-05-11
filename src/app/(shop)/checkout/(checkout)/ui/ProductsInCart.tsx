'use client';

import { useEffect, useState } from 'react';

import { useCartStore } from '@/store';
import { verifyCartProducts } from '@/actions';
import { ProductImage } from '@/components';
import { currencyFormat } from '@/utils';



export const ProductsInCart = () => {



  const removeProductById = useCartStore( state => state.removeProductById );

  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore( state => state.cart );


  useEffect(() => {
    setLoaded(true);

    const checkStock = async () => {
      const cart = useCartStore.getState().cart;
      if (cart.length === 0) return;
      const result = await verifyCartProducts(cart);
      result.stockIssues
        .filter((i) => i.available === 0)
        .forEach((i) => removeProductById(i.productId));
    };

    checkStock();
  },[]);




  if( !loaded ) {
    return <p>Loading...</p>
  }

  return (
    <>
      {productsInCart.map((product) => (
        <div key={ `${ product.slug }-${ product.size }-${ product.color }`  } className="flex mb-5">
          <ProductImage
            src={ product.image }
            width={100}
            height={100}
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
            alt={product.title}
            className="mr-5 rounded"
          />

          <div>
            <span className="uppercase">
              {[product.size, product.color ? product.color.split(':')[0] : undefined]
                .filter(Boolean)
                .join(' / ')}{' '}
              {product.title} ({ product.quantity })
            </span>
            
            <p className="font-bold">{ currencyFormat(product.price * product.quantity )  }</p>

          </div>
        </div>
      ))}
    </>
  );
};
