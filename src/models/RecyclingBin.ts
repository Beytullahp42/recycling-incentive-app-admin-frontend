export class RecyclingBin {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  qr_key: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  constructor(data: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    qr_key: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.qr_key = data.qr_key;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.deleted_at = data.deleted_at;
  }
}
