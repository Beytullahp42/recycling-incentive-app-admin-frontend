import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Barcode from "react-barcode";
import { toast } from "sonner";
import { EditRecyclableItemModal } from "@/components/EditRecyclableItemModal";
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
import { Trash2, Plus } from "lucide-react";
import {
  getAllRecyclableItems,
  deleteRecyclableItem,
} from "@/services/recyclable-items-endpoints";
import { RecyclableItem } from "@/models/RecyclableItem";

const RecyclableItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<RecyclableItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getAllRecyclableItems();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch recyclable items", error);
      toast.error("Failed to fetch recyclable items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // TODO: Sidebara kategorileri eklenecek

  const handleDelete = async (item: RecyclableItem) => {
    toast.promise(deleteRecyclableItem(item.id), {
      loading: "Deleting recyclable item...",
      success: () => {
        fetchItems();
        return "Recyclable item deleted successfully";
      },
      error: "Failed to delete recyclable item",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recyclable Items</h1>
        <Button onClick={() => navigate("/recyclable-items/create")}>
          <Plus className="h-4 w-4 md:mr-2 md:-ml-1" />
          <span className="hidden md:inline">Create New Item</span>
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Value</TableHead>
              <TableHead className="text-center">Barcode</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No recyclable items found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.category?.name || "-"}</TableCell>
                  <TableCell
                    className={`text-center ${
                      item.manual_value !== null ? "text-primary font-bold" : ""
                    }`}
                  >
                    {item.current_value}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center justify-center">
                      <Barcode
                        value={item.barcode}
                        height={28}
                        fontSize={12}
                        displayValue={false}
                      />
                      <span className="text-xs mt-1">{item.barcode}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(item.updated_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-2">
                      <EditRecyclableItemModal
                        item={item}
                        refreshItems={fetchItems}
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
                              This action cannot be undone. This will
                              permanently delete the recyclable item "
                              {item.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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

export default RecyclableItems;
