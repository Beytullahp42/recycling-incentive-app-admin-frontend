import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CreateRecyclingBinModal } from "@/components/CreateRecyclingBinModal";
import { EditRecyclingBinModal } from "@/components/EditRecyclingBinModal";
import { RecyclingBinQRModal } from "@/components/RecyclingBinQRModal";
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
  getAllRecyclingBins,
  deleteRecyclingBin,
} from "@/services/recycling-bins-endpoints";
import { RecyclingBin } from "@/models/RecyclingBin";

const RecyclingBins = () => {
  const [bins, setBins] = useState<RecyclingBin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBins = async () => {
    setLoading(true);
    try {
      const data = await getAllRecyclingBins();
      setBins(data);
    } catch (error) {
      console.error("Failed to fetch bins", error);
      toast.error("Failed to fetch recycling bins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
  }, []);

  const handleDelete = async (bin: RecyclingBin) => {
    toast.promise(deleteRecyclingBin(bin.id), {
      loading: "Deleting recycling bin...",
      success: () => {
        fetchBins();
        return "Recycling bin deleted successfully";
      },
      error: "Failed to delete recycling bin",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recycling Bins</h1>
        <CreateRecyclingBinModal refreshBins={fetchBins} />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Latitude</TableHead>
              <TableHead>Longitude</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : bins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No recycling bins found.
                </TableCell>
              </TableRow>
            ) : (
              bins.map((bin) => (
                <TableRow key={bin.id}>
                  <TableCell>{bin.id}</TableCell>
                  <TableCell className="font-medium">{bin.name}</TableCell>
                  <TableCell>{bin.latitude}</TableCell>
                  <TableCell>{bin.longitude}</TableCell>
                  <TableCell>
                    {new Date(bin.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(bin.updated_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center flex justify-center gap-2">
                    <RecyclingBinQRModal bin={bin} />
                    <EditRecyclingBinModal bin={bin} refreshBins={fetchBins} />
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
                            delete the recycling bin "{bin.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(bin)}
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

export default RecyclingBins;
