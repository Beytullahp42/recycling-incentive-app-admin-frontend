import { RecyclableItemCategory } from "./RecyclableItemCategory";

export class RecyclableItem {
  id: number;
  name: string;
  description: string;
  value: number;
  barcode: string;
  category_id: number | null;
  category?: RecyclableItemCategory | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  constructor(data: {
    id: number;
    name: string;
    description: string;
    value: number;
    barcode: string;
    category_id: number | null;
    category?: RecyclableItemCategory | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.value = data.value;
    this.barcode = data.barcode;
    this.category_id = data.category_id;
    this.category = data.category
      ? new RecyclableItemCategory(data.category)
      : null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.deleted_at = data.deleted_at;
  }
}
