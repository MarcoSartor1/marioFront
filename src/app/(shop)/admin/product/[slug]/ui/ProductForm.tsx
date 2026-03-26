"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Category, Product, ProductImage as ProductWithImage } from "@/interfaces";
import clsx from "clsx";
import { createUpdateProduct, deleteProductImage } from "@/actions";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components";

const MAX_PHOTOS = 5;

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[] };
  categories: Category[];
}

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  tags?: string;
  gender?: "" | "men" | "women" | "kid" | "unisex";
  categoryId?: string;
  sizes: string[];
  images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasSizesInitially = (product.sizes ?? []).length > 0;
  const [showSizes, setShowSizes] = useState(hasSizesInitially);
  const [existingImages, setExistingImages] = useState<ProductWithImage[]>(
    product.ProductImage ?? []
  );
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const totalPhotos = existingImages.length + pendingFiles.length;
  const remainingSlots = MAX_PHOTOS - totalPhotos;

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(", ") ?? "",
      sizes: product.sizes ?? [],
      gender: (product.gender as FormInputs["gender"]) ?? "",
      categoryId: (product as any).categoryId ?? "",
      images: undefined,
    },
  });

  watch("sizes");

  const onSizeChanged = (size: string) => {
    const current = new Set(getValues("sizes"));
    current.has(size) ? current.delete(size) : current.add(size);
    setValue("sizes", Array.from(current));
  };

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const available = MAX_PHOTOS - existingImages.length - pendingFiles.length;
    const toAdd = files.slice(0, available);

    if (files.length > available) {
      alert(`Solo puedes agregar ${available} foto(s) más (máximo ${MAX_PHOTOS} en total).`);
    }

    setPendingFiles((prev) => [...prev, ...toAdd]);
    // Reset input so same files can be re-selected after removal
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onDeleteExisting = async (image: ProductWithImage) => {
    const { ok } = await deleteProductImage(image.id, image.url);
    if (ok) {
      setExistingImages((prev) => prev.filter((img) => img.id !== image.id));
    }
  };

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();
    const { images: _images, ...productToSave } = data;

    if (product.id) formData.append("id", product.id);

    formData.append("title", productToSave.title);
    formData.append("slug", productToSave.slug);
    formData.append("description", productToSave.description);
    formData.append("price", productToSave.price.toString());
    formData.append("inStock", productToSave.inStock.toString());

    if (productToSave.tags?.trim()) formData.append("tags", productToSave.tags);
    if (productToSave.gender) formData.append("gender", productToSave.gender);
    if (productToSave.categoryId) formData.append("categoryId", productToSave.categoryId);
    if (showSizes && productToSave.sizes.length > 0)
      formData.append("sizes", productToSave.sizes.toString());

    for (const file of pendingFiles) {
      formData.append("images", file);
    }

    const { ok, product: updatedProduct } = await createUpdateProduct(formData);

    if (!ok) {
      alert("Producto no se pudo guardar");
      return;
    }

    router.replace(`/admin/product/${updatedProduct?.slug}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      {/* Columna izquierda */}
      <div className="w-full">
        {/* Título */}
        <div className="flex flex-col mb-2">
          <span>Título *</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("title", { required: true })}
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col mb-2">
          <span>Slug *</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("slug", { required: true })}
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col mb-2">
          <span>Descripción *</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register("description", { required: true })}
          />
        </div>

        {/* Precio */}
        <div className="flex flex-col mb-2">
          <span>Precio *</span>
          <input
            type="number"
            step="0.01"
            className="p-2 border rounded-md bg-gray-200"
            {...register("price", { required: true, min: 0 })}
          />
        </div>

        {/* Tags (opcional) */}
        <div className="flex flex-col mb-2">
          <span>Tags <span className="text-gray-400 text-sm">(opcional, separados por coma)</span></span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("tags")}
          />
        </div>

        {/* Género (opcional) */}
        <div className="flex flex-col mb-2">
          <span>Género <span className="text-gray-400 text-sm">(opcional)</span></span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("gender")}
          >
            <option value="">— No aplica —</option>
            <option value="men">Hombre</option>
            <option value="women">Mujer</option>
            <option value="kid">Niño</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        {/* Categoría (opcional) */}
        <div className="flex flex-col mb-2">
          <span>Categoría <span className="text-gray-400 text-sm">(opcional)</span></span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("categoryId")}
          >
            <option value="">— Sin categoría —</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-primary w-full">Guardar</button>
      </div>

      {/* Columna derecha */}
      <div className="w-full">
        {/* Inventario */}
        <div className="flex flex-col mb-2">
          <span>Inventario *</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("inStock", { required: true, min: 0 })}
          />
        </div>

        {/* Toggle tallas */}
        <div className="flex flex-col mb-3">
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={showSizes}
              onChange={(e) => {
                setShowSizes(e.target.checked);
                if (!e.target.checked) setValue("sizes", []);
              }}
              className="w-4 h-4"
            />
            <span>Este producto tiene tallas</span>
          </label>

          {showSizes && (
            <div className="flex flex-wrap">
              {availableSizes.map((size) => (
                <div
                  key={size}
                  onClick={() => onSizeChanged(size)}
                  className={clsx(
                    "p-2 border cursor-pointer rounded-md mr-2 mb-2 w-14 transition-all text-center",
                    {
                      "bg-blue-500 text-white": getValues("sizes").includes(size),
                    }
                  )}
                >
                  <span>{size}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fotos */}
        <div className="flex flex-col mb-3">
          <div className="flex items-center justify-between mb-1">
            <span>Fotos</span>
            <span className={clsx("text-sm", {
              "text-red-500": totalPhotos >= MAX_PHOTOS,
              "text-gray-400": totalPhotos < MAX_PHOTOS,
            })}>
              {totalPhotos}/{MAX_PHOTOS} fotos
            </span>
          </div>

          {remainingSlots > 0 && (
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={onFilesSelected}
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg, image/avif"
            />
          )}

          {remainingSlots === 0 && (
            <p className="text-sm text-red-500 mt-1">
              Límite de {MAX_PHOTOS} fotos alcanzado. Elimina alguna para agregar más.
            </p>
          )}
        </div>

        {/* Imágenes guardadas */}
        {existingImages.length > 0 && (
          <div className="mb-3">
            <span className="text-sm text-gray-500 mb-2 block">Fotos guardadas</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {existingImages.map((image) => (
                <div key={image.id}>
                  <ProductImage
                    alt={product.title ?? ""}
                    src={image.url}
                    width={300}
                    height={300}
                    className="rounded-t shadow-md object-cover w-full aspect-square"
                  />
                  <button
                    type="button"
                    onClick={() => onDeleteExisting(image)}
                    className="btn-danger w-full rounded-b-xl text-sm py-1"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Previews de nuevas fotos */}
        {pendingFiles.length > 0 && (
          <div className="mb-3">
            <span className="text-sm text-gray-500 mb-2 block">Fotos por agregar</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {pendingFiles.map((file, index) => (
                <div key={index}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="rounded-t shadow-md object-cover w-full aspect-square"
                  />
                  <button
                    type="button"
                    onClick={() => removePendingFile(index)}
                    className="btn-danger w-full rounded-b-xl text-sm py-1"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
