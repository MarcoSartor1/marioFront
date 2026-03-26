'use server';

import { auth } from '@/auth.config';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.string().uuid().optional().nullable(),
  sizes: z.string().optional().transform((val) => (val ? val.split(',').filter(Boolean) : [])),
  tags: z.string().optional().default(''),
  gender: z.enum(['men', 'women', 'kid', 'unisex']).optional().nullable(),
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);

  if (!productParsed.success) {
    console.log(productParsed.error);
    return { ok: false };
  }

  const product = productParsed.data;
  product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim();

  const { id, ...rest } = product;
  const tagsArray = rest.tags
    ? rest.tags.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean)
    : [];

  const session = await auth();
  const token = (session?.user as any)?.token as string | undefined;

  try {
    // Subir imágenes a Cloudinary
    const imageFiles = formData.getAll('images') as File[];
    const validFiles = imageFiles.filter((f) => f.size > 0);
    const uploadedImages = validFiles.length > 0 ? await uploadImages(validFiles) : [];

    if (uploadedImages === null) {
      return { ok: false, message: 'No se pudo cargar las imágenes' };
    }

    const body: Record<string, unknown> = {
      title: rest.title,
      slug: rest.slug,
      description: rest.description,
      price: rest.price,
      inStock: rest.inStock,
    };

    if (rest.categoryId) body.categoryId = rest.categoryId;
    if (rest.sizes && rest.sizes.length > 0) body.sizes = rest.sizes;
    if (tagsArray.length > 0) body.tags = tagsArray;
    if (rest.gender) body.gender = rest.gender;
    if (uploadedImages.length > 0) body.images = uploadedImages.filter(Boolean);

    console.log('=== createUpdateProduct - body enviado al backend ===');
    console.log(JSON.stringify(body, null, 2));
    console.log('URL:', `${process.env.API_URL}/products${id ? `/${id}` : ''}`);
    console.log('Método:', id ? 'PATCH' : 'POST');
    console.log('=====================================================');

    const resp = await fetch(
      `${process.env.API_URL}/products${id ? `/${id}` : ''}`,
      {
        method: id ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      }
    );

    if (!resp.ok) {
      const error = await resp.json().catch(() => ({}));
      console.log(error);
      return { ok: false, message: error.message ?? 'No se pudo actualizar/crear' };
    }

    const savedProduct = await resp.json();

    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${savedProduct.slug}`);
    revalidatePath(`/products/${savedProduct.slug}`);

    return { ok: true, product: savedProduct };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'Revisar los logs, no se pudo actualizar/crear' };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        return cloudinary.uploader
          .upload(`data:image/png;base64,${base64Image}`)
          .then((r) => r.secure_url);
      } catch (error) {
        console.log(error);
        return null;
      }
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.log(error);
    return null;
  }
};
