import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CreateRecyclableItemCategoryModal } from "@/components/CreateRecyclableItemCategoryModal";
import { EditRecyclableItemCategoryModal } from "@/components/EditRecyclableItemCategoryModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  getAllRecyclableItemCategories,
  deleteRecyclableItemCategory,
} from "@/services/recyclable-item-categories-endpoints";
import { RecyclableItemCategory } from "@/models/RecyclableItemCategory";

const RecyclableItemCategories = () => {
  const [categories, setCategories] = useState<RecyclableItemCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllRecyclableItemCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Failed to fetch recyclable item categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (category: RecyclableItemCategory) => {
    toast.promise(deleteRecyclableItemCategory(category.id), {
      loading: "Deleting category...",
      success: () => {
        fetchCategories();
        return "Category deleted successfully";
      },
      error: "Failed to delete category",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recyclable Item Categories</h1>
        <CreateRecyclableItemCategoryModal
          refreshCategories={fetchCategories}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.value}</TableCell>
                  <TableCell>
                    {new Date(category.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(category.updated_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center flex justify-center gap-2">
                    <EditRecyclableItemCategoryModal
                      category={category}
                      refreshCategories={fetchCategories}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the category "{category.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecyclableItemCategories;
