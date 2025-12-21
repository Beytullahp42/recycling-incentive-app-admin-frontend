import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { createRecyclableItemCategory } from "@/services/recyclable-item-categories-endpoints";
import type { RecyclableItemCategoryDTO } from "@/dtos/RecyclableItemCategoryDTO";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), "Value must be a number")
    .refine((val) => parseFloat(val) >= 0, "Value must be 0 or greater"),
});

interface CreateRecyclableItemCategoryModalProps {
  refreshCategories: () => void;
}

export function CreateRecyclableItemCategoryModal({
  refreshCategories,
}: CreateRecyclableItemCategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const dto: RecyclableItemCategoryDTO = {
      name: values.name,
      value: parseFloat(values.value),
    };

    toast.promise(createRecyclableItemCategory(dto), {
      loading: "Creating category...",
      success: () => {
        refreshCategories();
        setOpen(false);
        reset();
        return "Category created successfully";
      },
      error: "Failed to create category",
      finally: () => setLoading(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Recyclable Item Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <div className="col-span-3">
              <Input id="name" {...register("name")} className="col-span-3" />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              Value
            </Label>
            <div className="col-span-3">
              <Input
                id="value"
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
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
