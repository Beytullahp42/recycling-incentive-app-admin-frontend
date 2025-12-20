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
import { updateRecyclingBin } from "@/services/recycling-bins-endpoints";
import { RecyclingBin } from "@/models/RecyclingBin";
import type { RecyclingBinDTO } from "@/dtos/RecyclingBinDTO";
import { Pencil } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  latitude: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), "Latitude must be a number"),
  longitude: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), "Longitude must be a number"),
});

interface EditRecyclingBinModalProps {
  bin: RecyclingBin;
  refreshBins: () => void;
}

export function EditRecyclingBinModal({
  bin,
  refreshBins,
}: EditRecyclingBinModalProps) {
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
      name: bin.name,
      latitude: bin.latitude.toString(),
      longitude: bin.longitude.toString(),
    },
  });

  // Reset form when bin changes
  useEffect(() => {
    reset({
      name: bin.name,
      latitude: bin.latitude.toString(),
      longitude: bin.longitude.toString(),
    });
  }, [bin, reset]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const dto: Partial<RecyclingBinDTO> = {
      name: values.name,
      latitude: parseFloat(values.latitude),
      longitude: parseFloat(values.longitude),
    };

    toast.promise(updateRecyclingBin(bin.id, dto), {
      loading: "Updating recycling bin...",
      success: () => {
        refreshBins();
        setOpen(false);
        return "Recycling bin updated successfully";
      },
      error: "Failed to update recycling bin",
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
          <DialogTitle>Edit RecyclingBin</DialogTitle>
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
            <Label htmlFor="edit-latitude" className="text-right">
              Latitude
            </Label>
            <div className="col-span-3">
              <Input
                id="edit-latitude"
                {...register("latitude")}
                className="col-span-3"
              />
              {errors.latitude && (
                <span className="text-red-500 text-sm">
                  {errors.latitude.message}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-longitude" className="text-right">
              Longitude
            </Label>
            <div className="col-span-3">
              <Input
                id="edit-longitude"
                {...register("longitude")}
                className="col-span-3"
              />
              {errors.longitude && (
                <span className="text-red-500 text-sm">
                  {errors.longitude.message}
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
