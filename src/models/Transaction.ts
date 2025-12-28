export type TransactionStatus = "accepted" | "flagged" | "rejected";
import { RecyclableItem } from "./RecyclableItem";

export class Transaction {
  id: number;
  user_id: number;
  recycling_session_id: number;
  recyclable_item_id: number;
  barcode: string;
  points_awarded: number;
  status: TransactionStatus;
  created_at: string;
  updated_at: string;
  item: RecyclableItem;

  constructor(data: {
    id: number;
    user_id: number;
    recycling_session_id: number;
    recyclable_item_id: number;
    barcode: string;
    points_awarded: number;
    status: TransactionStatus;
    created_at: string;
    updated_at: string;
    item: RecyclableItem;
  }) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.recycling_session_id = data.recycling_session_id;
    this.recyclable_item_id = data.recyclable_item_id;
    this.barcode = data.barcode;
    this.points_awarded = data.points_awarded;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.item = new RecyclableItem(data.item);
  }
}
