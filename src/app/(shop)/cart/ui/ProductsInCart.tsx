'use client';
import { useEffect, useState } from 'react';


import { useCartStore } from '@/store';
import { verifyCartProducts } from '@/actions';
import { ProductImage, QuantitySelector } from '@/components';
import Link from 'next/link';



export const ProductsInCart = () => {

  const updateProductQuantity = useCartStore( state => state.updateProductQuantity );
  const removeProduct = useCartStore( state => state.removeProduct );
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
            src={product.image }
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={product.title}
            className="mr-5 rounded"
          />

          <div>
            <Link
              className="hover:underline cursor-pointer uppercase"
              href={ `/product/${ product.slug } ` }>
              {[product.size, product.color ? product.color.split(':')[0] : undefined]
                .filter(Boolean)
                .join(' / ')} {product.title}
            </Link>
            
            <p>${product.price}</p>
            <QuantitySelector 
              quantity={ product.quantity } 
              onQuantityChanged={ quantity => updateProductQuantity(product, quantity) }
            />

            <button 
              onClick={ () => removeProduct(product) }
              className="underline mt-3">Remover</button>
          </div>
        </div>
      ))}
    </>
  );
};
