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
import { updateRecyclableItem } from "@/services/recyclable-items-endpoints";
import { RecyclableItem } from "@/models/RecyclableItem";
import type { RecyclableItemDTO } from "@/dtos/RecyclableItemDTO";
import { Pencil } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  value: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(parseFloat(val)), "Value must be a number"),
  barcode: z.string().min(1, "Barcode is required"),
});

interface EditRecyclableItemModalProps {
  item: RecyclableItem;
  refreshItems: () => void;
}

export function EditRecyclableItemModal({
  item,
  refreshItems,
}: EditRecyclableItemModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      description: item.description,
      value: item.value?.toString() ?? "",
      barcode: item.barcode,
    },
  });

  // Reset form when item changes
  useEffect(() => {
    reset({
      name: item.name,
      description: item.description,
      value: item.value?.toString() ?? "",
      barcode: item.barcode,
    });
  }, [item, reset]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const dto: Partial<RecyclableItemDTO> = {
      name: values.name,
      description: values.description || "",
      value: values.value ? parseFloat(values.value) : null,
      barcode: values.barcode,
    };

    try {
      await updateRecyclableItem(item.id, dto);
      toast.success("Recyclable item updated successfully");
      refreshItems();
      setOpen(false);
    } catch (error: any) {
      console.error("Failed to update recyclable item", error);
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          Object.keys(validationErrors).forEach((key) => {
            setError(key as any, {
              type: "manual",
              message: validationErrors[key][0],
            });
          });
        }
        toast.error("Validation failed. Please check the form.");
      } else {
        toast.error("Failed to update recyclable item");
      }
    } finally {
      setLoading(false);
    }
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
          <DialogTitle>Edit Recyclable Item</DialogTitle>
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
            <Label htmlFor="edit-description" className="text-right">
              Description
            </Label>
            <div className="col-span-3">
              <Input
                id="edit-description"
                {...register("description")}
                className="col-span-3"
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-barcode" className="text-right">
              Barcode
            </Label>
            <div className="col-span-3">
              <Input
                id="edit-barcode"
                {...register("barcode")}
                className="col-span-3"
              />
              {errors.barcode && (
                <span className="text-red-500 text-sm">
                  {errors.barcode.message}
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
