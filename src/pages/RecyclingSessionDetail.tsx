import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  MapPin,
  History,
  User,
  Package,
  Image,
} from "lucide-react";

import { getRecyclingSession } from "@/services/recycling-sessions-endpoints";
import { RecyclingSession } from "@/models/RecyclingSession";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { updateRecyclingSessionStatus } from "@/services/recycling-sessions-endpoints";
import { toast } from "sonner";

export default function RecyclingSessionDetail() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<RecyclingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"accepted" | "rejected">(
    "accepted"
  );
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (!session) return;
    setUpdating(true);
    try {
      await updateRecyclingSessionStatus(session.id, selectedStatus);
      toast.success("Session status updated successfully");
      setStatusDialogOpen(false);
      fetchSession(session.id.toString());
    } catch (error) {
      toast.error("Failed to update session status");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSession(id);
    }
  }, [id]);

  const fetchSession = async (sessionId: string) => {
    setLoading(true);
    try {
      const data = await getRecyclingSession(sessionId);
      setSession(data);
    } catch (error) {
      console.error("Failed to fetch session details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "accepted":
        return "text-green-500";
      case "flagged":
        return "text-yellow-500";
      case "expired":
      case "closed":
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
      case "active":
        return <CheckCircle2 className="w-4 h-4 ml-1" />;
      case "flagged":
        return <AlertTriangle className="w-4 h-4 ml-1" />;
      case "rejected":
      case "closed":
      case "expired":
        return <XCircle className="w-4 h-4 ml-1" />;
      default:
        return <Clock className="w-4 h-4 ml-1" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold">Session Not Found</h2>
        <Button asChild>
          <Link to="/recycling-sessions">Go Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/recycling-sessions">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex items-center">
              Session #{session.id}
            </h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="w-4 h-4 mr-2" />
              {format(new Date(session.created_at), "PPP p")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session.audit_status === "flagged" && (
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Manage Status
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Session Status</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <RadioGroup
                    value={selectedStatus}
                    onValueChange={(val) => setSelectedStatus(val as any)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="accepted" id="accepted" />
                      <Label htmlFor="accepted">Accept</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rejected" id="rejected" />
                      <Label htmlFor="rejected">Reject</Label>
                    </div>
                  </RadioGroup>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setStatusDialogOpen(false)}
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleStatusUpdate} disabled={updating}>
                    {updating ? "Updating..." : "Confirm Update"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {session.proof_photo_path && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Image className="w-4 h-4 mr-2" />
                  View Proof Photo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Proof Photo</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center p-4 bg-muted/20 rounded-lg">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/storage/${
                      session.proof_photo_path
                    }`}
                    alt="Session Proof"
                    className="max-h-[70vh] w-auto object-contain roundedShadow-sm"
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}

          <div
            className={`flex items-center px-4 py-2 rounded-full border bg-background font-medium ${getStatusColor(
              session.audit_status
            )}`}
          >
            <span className="capitalize mr-2">{session.audit_status}</span>
            {getStatusIcon(session.audit_status)}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Points Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                session.accepted_points +
                session.flagged_points +
                session.rejected_points
              ).toLocaleString()}
            </div>
            <div className="flex items-center space-x-4 mt-2 text-xs">
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {session.accepted_points}
              </div>
              <div className="flex items-center text-yellow-600">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {session.flagged_points}
              </div>
              <div className="flex items-center text-red-600">
                <XCircle className="w-3 h-3 mr-1" />
                {session.rejected_points}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Count */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Items Scanned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {session.transactions_count ?? session.transactions?.length ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Items processed in this session
            </p>
          </CardContent>
        </Card>

        {/* Life Cycle Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Life Cycle Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {session.lifecycle_status}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <History className="w-3 h-3 mr-1" />
              {session.ended_at
                ? `Ended ${format(new Date(session.ended_at), "p")}`
                : `Expires ${format(new Date(session.expires_at), "p")}`}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="w-5 h-5 mr-2" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session.user.profile ? (
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">
                    {session.user.profile.first_name[0]}
                    {session.user.profile.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">
                    {session.user.profile.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    @{session.user.profile.username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session.user.email}
                  </p>
                  <div className="flex items-center pt-2 text-xs text-muted-foreground">
                    <span className="bg-muted px-2 py-1 rounded-full">
                      Points Balance: {session.user.profile.points}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">
                  User #{session.user_id}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bin Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              Bin Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session.bin ? (
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Bin Name</span>
                  <span className="font-medium">{session.bin.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-mono">{session.bin.id}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">QR Key</span>
                  <span className="font-mono text-xs">
                    {session.bin.qr_key}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-mono text-xs">
                    {session.bin.latitude.toFixed(6)},{" "}
                    {session.bin.longitude.toFixed(6)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bin ID</span>
                <span className="font-mono">{session.recycling_bin_id}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Package className="w-5 h-5 mr-2" />
            Transactions
          </CardTitle>
          <CardDescription>
            Detailed list of items scanned during this session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {session.transactions && session.transactions.length > 0 ? (
                session.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-xs">
                      #{transaction.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.item ? (
                        transaction.item.name
                      ) : (
                        <span className="text-muted-foreground italic">
                          Unknown Item
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {transaction.barcode}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(transaction.created_at), "HH:mm:ss")}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {transaction.points_awarded}
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          transaction.status
                        )
                          .replace("text-", "bg-")
                          .replace("500", "100")} ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found for this session.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
