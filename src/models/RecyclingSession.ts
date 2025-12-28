import { Transaction, type TransactionStatus } from "./Transaction";
import { User } from "./User";
import { RecyclingBin } from "./RecyclingBin";

export type LifecycleStatus = "active" | "closed";

export class RecyclingSession {
  id: number;
  user_id: number;
  recycling_bin_id: number;
  session_token: string;
  started_at: string;
  expires_at: string;
  ended_at: string | null;
  lifecycle_status: LifecycleStatus;
  audit_status: TransactionStatus;
  proof_photo_path: string | null;
  created_at: string;
  updated_at: string;
  accepted_points: number;
  flagged_points: number;
  rejected_points: number;
  transactions?: Transaction[];
  user: User;
  bin: RecyclingBin;
  transactions_count?: number;

  constructor(data: {
    id: number;
    user_id: number;
    recycling_bin_id: number;
    session_token: string;
    started_at: string;
    expires_at: string;
    ended_at: string | null;
    lifecycle_status: LifecycleStatus;
    audit_status: TransactionStatus;
    proof_photo_path: string | null;
    created_at: string;
    updated_at: string;
    accepted_points: number;
    flagged_points: number;
    rejected_points: number;
    transactions?: any[];
    user: any;
    bin: any;
    transactions_count?: number;
  }) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.recycling_bin_id = data.recycling_bin_id;
    this.session_token = data.session_token;
    this.started_at = data.started_at;
    this.expires_at = data.expires_at;
    this.ended_at = data.ended_at;
    this.lifecycle_status = data.lifecycle_status;
    this.audit_status = data.audit_status;
    this.proof_photo_path = data.proof_photo_path;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.accepted_points = data.accepted_points;
    this.flagged_points = data.flagged_points;
    this.rejected_points = data.rejected_points;
    this.transactions = data.transactions
      ? data.transactions.map((t) => new Transaction(t))
      : undefined;
    this.user = new User(data.user);
    this.bin = new RecyclingBin(data.bin);
    this.transactions_count = data.transactions_count;
  }
}
