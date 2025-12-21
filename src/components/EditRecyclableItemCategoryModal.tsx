import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateRecyclableItemCategory } from "@/services/recyclable-item-categories-endpoints";
import { RecyclableItemCategory } from "@/models/RecyclableItemCategory";
import type { RecyclableItemCategoryDTO } from "@/dtos/RecyclableItemCategoryDTO";
import { Pencil } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), "Value must be a number"),
});

interface EditRecyclableItemCategoryModalProps {
  category: RecyclableItemCategory;
  refreshCategories: () => void;
}

export function EditRecyclableItemCategoryModal({
  category,
  refreshCategories,
}: EditRecyclableItemCategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      value: category.value.toString(),
    },
  });

  // Reset form when category changes
  useEffect(() => {
    reset({
      name: category.name,
      value: category.value.toString(),
    });
  }, [category, reset]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const dto: Partial<RecyclableItemCategoryDTO> = {
      name: values.name,
      value: parseFloat(values.value),
    };

    toast.promise(updateRecyclableItemCategory(category.id, dto), {
      loading: "Updating category...",
      success: () => {
        refreshCategories();
        setOpen(false);
        return "Category updated successfully";
      },
      error: "Failed to update category",
      finally: () => setLoading(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Name
            </Label>
            <div className="col-span-3">
              <Input
                id="edit-name"
                {...register("name")}
                className="col-span-3"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-value" className="text-right">
              Value
            </Label>
            <div className="col-span-3">
              <Input
                id="edit-value"
                type="number"
                {...register("value")}
                className="col-span-3"
              />
              {errors.value && (
                <span className="text-red-500 text-sm">
                  {errors.value.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
