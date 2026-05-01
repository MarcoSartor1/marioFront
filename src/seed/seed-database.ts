import prisma from '../lib/prisma';
import { initialData } from './seed';
import { countries } from './seed-countries';



async function main() {

  // 1. Borrar registros previos
  // await Promise.all( [

  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();


  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.storeConfig.deleteMany();
  // ]);

  const { categories, products, users } = initialData;

  // 2. Crear configuración inicial de la tienda (White Label)
  await prisma.storeConfig.create({
    data: {
      name: 'Costumbres Argentinas',
      primaryColor: '#3b82f6',      // Azul (Tailwind blue-500)
      secondaryColor: '#1e293b',    // Slate oscuro (Tailwind slate-800)
      logoUrl: null,                // Sin logo por defecto
      bankName: 'Banco Ejemplo',
      bankAccount: '1234567890',
      bankAccountType: 'Cuenta Corriente',
      bankOwnerName: 'Teslo Shop SA',
      bankCbu: '0000003100012345678901',
      bankAlias: 'teslo.shop.mp',
      shippingInfo: 'Envíos a todo el país. CABA y GBA: 24-48hs. Interior: 3-5 días hábiles.',
      contactEmail: 'contacto@teslo-shop.com',
      contactPhone: '+54 9 11 1234-5678',
    },
  });

  console.log('✅ Configuración de tienda creada');


  await prisma.user.createMany({
    data: users
  });

  await prisma.country.createMany({
    data: countries
  });



  //  Categorias
  // {
  //   name: 'Shirt'
  // }
  const categoriesData = categories.map( (name) => ({ name }));
  
  await prisma.category.createMany({
    data: categoriesData
  });

  
  const categoriesDB = await prisma.category.findMany();
  
  const categoriesMap = categoriesDB.reduce( (map: Record<string, string>, category) => {
    map[ category.name.toLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>); //<string=shirt, string=categoryID>
  
  

  // Productos

  products.forEach( async(product) => {

    const { type, images, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type]
      }
    })


    // Images
    const imagesData = images.map( image => ({
      url: image,
      productId: dbProduct.id
    }));

    await prisma.productImage.createMany({
      data: imagesData
    });

  });





  console.log( 'Seed ejecutado correctamente' );
}









( () => {

  if ( process.env.NODE_ENV === 'production' ) return;


  main();
} )();