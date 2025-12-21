import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllRecyclableItemCategories } from "@/services/recyclable-item-categories-endpoints";
import { RecyclableItemCategory } from "@/models/RecyclableItemCategory";

interface CategorySelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CategorySelect({
  value,
  onChange,
  error,
}: CategorySelectProps) {
  const [categories, setCategories] = useState<RecyclableItemCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await getAllRecyclableItemCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue
            placeholder={loading ? "Loading..." : "Select a category"}
          />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name} (Value: {category.value})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
