export interface RecyclableItemDTO {
  name: string;
  description: string;
  manual_value?: number | null;
  barcode: string;
  category_id?: number | null;
}
