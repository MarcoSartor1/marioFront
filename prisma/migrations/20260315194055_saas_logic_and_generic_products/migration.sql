-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('mercadopago', 'transfer');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'mercadopago',
ADD COLUMN     "paymentReceipt" TEXT,
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "size" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "gender" DROP NOT NULL;

-- CreateTable
CREATE TABLE "StoreConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Mi Tienda',
    "logoUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#3b82f6',
    "secondaryColor" TEXT NOT NULL DEFAULT '#1e293b',
    "bankName" TEXT,
    "bankAccount" TEXT,
    "bankAccountType" TEXT,
    "bankOwnerName" TEXT,
    "bankCbu" TEXT,
    "bankAlias" TEXT,
    "shippingInfo" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreConfig_pkey" PRIMARY KEY ("id")
);
