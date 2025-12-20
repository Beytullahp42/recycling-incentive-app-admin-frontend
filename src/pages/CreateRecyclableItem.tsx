import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createRecyclableItem } from "@/services/recyclable-items-endpoints";
import type { RecyclableItemDTO } from "@/dtos/RecyclableItemDTO";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  value: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(parseFloat(val)), "Value must be a number"),
  barcode: z.string().min(1, "Barcode is required"),
});

const CreateRecyclableItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const dto: RecyclableItemDTO = {
      name: values.name,
      description: values.description || "",
      value: values.value ? parseFloat(values.value) : undefined,
      barcode: values.barcode,
    };

    try {
      await createRecyclableItem(dto);
      toast.success("Recyclable item created successfully");
      navigate("/recyclable-items");
    } catch (error: any) {
      console.error("Failed to create recyclable item", error);
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
        toast.error("Failed to create recyclable item");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <Button
        variant="ghost"
        className="mb-4 pl-0 hover:bg-transparent hover:text-primary"
        onClick={() => navigate("/recyclable-items")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to List
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Recyclable Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} placeholder="Item Name" />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                {...register("description")}
                placeholder="Item Description"
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                {...register("value")}
                placeholder="Default: 5"
              />
              {errors.value && (
                <span className="text-red-500 text-sm">
                  {errors.value.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                {...register("barcode")}
                placeholder="Scan or enter barcode"
              />
              {errors.barcode && (
                <span className="text-red-500 text-sm">
                  {errors.barcode.message}
                </span>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Creating..." : "Create Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRecyclableItem;
