export interface PackagingBoxInput {
  name: string;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  emptyWeightGrams: number;
  maxWeightGrams: number | null;
  notes: string;
  isActive: boolean;
}

export interface PackagingBox extends PackagingBoxInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
