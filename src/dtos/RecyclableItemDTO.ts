export interface RecyclableItemDTO {
  name: string;
  description: string;
  value?: number | null;
  barcode: string;
  category_id?: number | null;
}
