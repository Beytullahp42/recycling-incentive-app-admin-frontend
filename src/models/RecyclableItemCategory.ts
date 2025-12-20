export class RecyclableItemCategory {
  id: number;
  name: string;
  value: number;
  created_at: string;
  updated_at: string;

  constructor(data: {
    id: number;
    name: string;
    value: number;
    created_at: string;
    updated_at: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.value = data.value;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
