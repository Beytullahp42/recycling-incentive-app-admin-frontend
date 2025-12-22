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
import { createRecyclingBin } from "@/services/recycling-bins-endpoints";
import type { RecyclingBinDTO } from "@/dtos/RecyclingBinDTO";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  latitude: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), "Latitude must be a number"),
  longitude: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), "Longitude must be a number"),
});

interface CreateRecyclingBinModalProps {
  refreshBins: () => void;
}

export function CreateRecyclingBinModal({
  refreshBins,
}: CreateRecyclingBinModalProps) {
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
    const dto: RecyclingBinDTO = {
      name: values.name,
      latitude: parseFloat(values.latitude),
      longitude: parseFloat(values.longitude),
    };

    toast.promise(createRecyclingBin(dto), {
      loading: "Creating recycling bin...",
      success: () => {
        refreshBins();
        setOpen(false);
        reset();
        return "Recycling bin created successfully";
      },
      error: "Failed to create recycling bin",
      finally: () => setLoading(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 md:mr-2 md:-ml-1" />
          <span className="hidden md:inline">Create a Recycling Bin</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Recycling Bin</DialogTitle>
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
            <Label htmlFor="latitude" className="text-right">
              Latitude
            </Label>
            <div className="col-span-3">
              <Input
                id="latitude"
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
            <Label htmlFor="longitude" className="text-right">
              Longitude
            </Label>
            <div className="col-span-3">
              <Input
                id="longitude"
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
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
