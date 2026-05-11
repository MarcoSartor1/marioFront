"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Category, Product, ProductImage as ProductWithImage } from "@/interfaces";
import clsx from "clsx";
import { createUpdateProduct, deleteProductImage } from "@/actions";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components";

const MAX_PHOTOS = 5;

function getCloudinaryAngle(url: string): number {
  const m = url.match(/\/a_(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function setCloudinaryAngle(url: string, angle: number): string {
  const normalized = ((angle % 360) + 360) % 360;
  if (url.includes("/a_")) {
    if (normalized === 0) return url.replace(/\/a_\d+/, "");
    return url.replace(/a_\d+/, `a_${normalized}`);
  }
  if (normalized === 0) return url;
  return url.replace("/upload/", `/upload/a_${normalized}/`);
}

async function rotateFileByDegrees(file: File, degrees: number): Promise<File> {
  if (degrees === 0) return file;
  return new Promise((resolve) => {
    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.onload = () => {
      const rad = (degrees * Math.PI) / 180;
      const canvas = document.createElement("canvas");
      if (degrees === 90 || degrees === 270) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      const ctx = canvas.getContext("2d")!;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      URL.revokeObjectURL(objUrl);
      canvas.toBlob(
        (blob) => resolve(new File([blob!], file.name, { type: file.type })),
        file.type
      );
    };
    img.src = objUrl;
  });
}

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
  colors: string[];
  images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasSizesInitially = (product.sizes ?? []).length > 0;
  const [showSizes, setShowSizes] = useState(hasSizesInitially);
  const hasColorsInitially = ((product as any).colors ?? []).length > 0;
  const [showColors, setShowColors] = useState(hasColorsInitially);
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#000000');
  const [existingImages, setExistingImages] = useState<ProductWithImage[]>(
    product.ProductImage ?? []
  );
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [existingRotations, setExistingRotations] = useState<Record<string, number>>({});
  const [pendingRotations, setPendingRotations] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      colors: (product as any).colors ?? [],
      gender: (product.gender as FormInputs["gender"]) ?? "",
      categoryId: (product as any).categoryId ?? "",
      images: undefined,
    },
  });

  watch("sizes");
  watch("colors");

  const onAddColor = () => {
    const name = colorName.trim();
    if (!name) return;
    const colorStr = `${name}:${colorHex}`;
    const current = getValues("colors");
    if (current.includes(colorStr)) return;
    setValue("colors", [...current, colorStr]);
    setColorName('');
    setColorHex('#000000');
  };

  const onRemoveColor = (colorStr: string) => {
    setValue("colors", getValues("colors").filter((c) => c !== colorStr));
  };

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
    setPendingRotations((prev) => {
      const next: Record<number, number> = {};
      Object.entries(prev).forEach(([key, val]) => {
        const k = parseInt(key, 10);
        if (k < index) next[k] = val;
        else if (k > index) next[k - 1] = val;
      });
      return next;
    });
  };

  const rotateExisting = (url: string) => {
    setExistingRotations((prev) => ({
      ...prev,
      [url]: ((prev[url] ?? 0) + 90) % 360,
    }));
  };

  const rotatePending = (index: number) => {
    setPendingRotations((prev) => ({
      ...prev,
      [index]: ((prev[index] ?? 0) + 90) % 360,
    }));
  };

  const onDeleteExisting = async (image: ProductWithImage) => {
    const { ok } = await deleteProductImage(image.url);
    if (ok) {
      setExistingImages((prev) => prev.filter((img) => img.id !== image.id));
      setExistingRotations((prev) => {
        const next = { ...prev };
        delete next[image.url];
        return next;
      });
    }
  };

  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

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
    if (showColors && productToSave.colors.length > 0)
      formData.append("colors", productToSave.colors.join(','));

    for (const img of existingImages) {
      const userRotation = existingRotations[img.url] ?? 0;
      if (userRotation > 0) {
        const storedAngle = getCloudinaryAngle(img.url);
        const finalAngle = (storedAngle + userRotation) % 360;
        formData.append("existingImages", setCloudinaryAngle(img.url, finalAngle));
      } else {
        formData.append("existingImages", img.url);
      }
    }

    const rotatedFiles = await Promise.all(
      pendingFiles.map((file, i) => rotateFileByDegrees(file, pendingRotations[i] ?? 0))
    );
    for (const file of rotatedFiles) {
      formData.append("images", file);
    }

    const { ok, message, product: updatedProduct } = await createUpdateProduct(formData);

    setIsLoading(false);

    if (!ok) {
      setErrorMessage(message ?? "No se pudo guardar el producto");
      return;
    }

    setPendingFiles([]);
    setExistingRotations({});
    setPendingRotations({});
    if (updatedProduct?.images) {
      setExistingImages(
        updatedProduct.images.map((url: string, index: number) => ({
          id: index,
          url,
          productId: updatedProduct.id,
        }))
      );
    }

    setSuccessMessage("Producto guardado correctamente");
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
            {...register("price", { min: 0 })}
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

        {errorMessage && (
          <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
        )}

        {successMessage && (
          <p className="text-green-600 text-sm mb-2">{successMessage}</p>
        )}

        <button
          disabled={isLoading}
          className={clsx("btn-primary w-full", { "opacity-70 cursor-not-allowed": isLoading })}
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
      </div>

      {/* Columna derecha */}
      <div className="w-full">
        {/* Inventario */}
        <div className="flex flex-col mb-2">
          <span>Inventario *</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("inStock", { min: 0 })}
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

        {/* Colores */}
        <div className="flex flex-col mb-3">
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={showColors}
              onChange={(e) => {
                setShowColors(e.target.checked);
                if (!e.target.checked) setValue("colors", []);
              }}
              className="w-4 h-4"
            />
            <span>Este producto tiene colores</span>
          </label>

          {showColors && (
            <div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Nombre del color"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddColor())}
                  className="p-2 border rounded-md bg-gray-200 flex-1 text-sm"
                />
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                  title="Seleccionar color"
                />
                <button
                  type="button"
                  onClick={onAddColor}
                  disabled={!colorName.trim()}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm disabled:opacity-40"
                >
                  Agregar
                </button>
              </div>

              {getValues("colors").length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {getValues("colors").map((colorStr) => {
                    const idx = colorStr.lastIndexOf(':');
                    const name = idx !== -1 ? colorStr.slice(0, idx) : colorStr;
                    const hex = idx !== -1 && colorStr[idx + 1] === '#' ? colorStr.slice(idx + 1) : '#cccccc';
                    return (
                      <div
                        key={colorStr}
                        className="flex items-center gap-1 bg-gray-100 border border-gray-300 rounded-full px-2 py-1"
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-gray-400 inline-block flex-shrink-0"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="text-sm">{name}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveColor(colorStr)}
                          className="text-gray-400 hover:text-red-500 ml-1 text-xs leading-none"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
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
                  <div className="overflow-hidden rounded-t shadow-md aspect-square w-full">
                    <div
                      className="w-full h-full transition-transform duration-200"
                      style={{ transform: `rotate(${existingRotations[image.url] ?? 0}deg)` }}
                    >
                      <ProductImage
                        alt={product.title ?? ""}
                        src={image.url}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="flex rounded-b-xl overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => rotateExisting(image.url)}
                      className="bg-sky-500 hover:bg-sky-600 text-white flex-1 py-1 transition-colors"
                    >
                      ↻ Girar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteExisting(image)}
                      className="bg-red-500 hover:bg-red-600 text-white flex-1 py-1 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
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
                <div key={`${file.name}-${index}`}>
                  <div className="overflow-hidden rounded-t shadow-md aspect-square w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-cover w-full h-full transition-transform duration-200"
                      style={{ transform: `rotate(${pendingRotations[index] ?? 0}deg)` }}
                    />
                  </div>
                  <div className="flex rounded-b-xl overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => rotatePending(index)}
                      className="bg-sky-500 hover:bg-sky-600 text-white flex-1 py-1 transition-colors"
                    >
                      ↻ Girar
                    </button>
                    <button
                      type="button"
                      onClick={() => removePendingFile(index)}
                      className="bg-red-500 hover:bg-red-600 text-white flex-1 py-1 transition-colors"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
