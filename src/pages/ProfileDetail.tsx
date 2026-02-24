import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  User,
  AtSign,
  Trophy,
  Mail,
  Shield,
  Hash,
  FileText,
  Clock,
  Save,
} from "lucide-react";

import {
  getAdminProfile,
  updateAdminProfile,
} from "@/services/profiles-endpoints";
import type { AdminUpdateProfileDTO } from "@/dtos/AdminUpdateProfileDTO";
import { AdminProfileResponse } from "@/models/AdminProfileResponse";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface EditableFields {
  first_name: string;
  last_name: string;
  username: string;
  bio: string;
  birth_date: string;
  points: number;
  email: string;
  role: "user" | "admin";
}

export default function ProfileDetail() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<AdminProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Editable form state
  const [form, setForm] = useState<EditableFields>({
    first_name: "",
    last_name: "",
    username: "",
    bio: "",
    birth_date: "",
    points: 0,
    email: "",
    role: "user",
  });

  // Original values to diff against
  const [original, setOriginal] = useState<EditableFields>({
    first_name: "",
    last_name: "",
    username: "",
    bio: "",
    birth_date: "",
    points: 0,
    email: "",
    role: "user",
  });

  useEffect(() => {
    if (username) {
      fetchProfile(username);
    }
  }, [username]);

  const fetchProfile = async (uname: string) => {
    setLoading(true);
    try {
      const response = await getAdminProfile(uname);
      setData(response);
      const initial: EditableFields = {
        first_name: response.profile.first_name,
        last_name: response.profile.last_name,
        username: response.profile.username,
        bio: response.profile.bio || "",
        birth_date: response.profile.birth_date,
        points: response.profile.points,
        email: response.user.email,
        role: response.user.role as "user" | "admin",
      };
      setForm(initial);
      setOriginal(initial);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getChanges = (): { label: string; from: string; to: string }[] => {
    const changes: { label: string; from: string; to: string }[] = [];
    const labels: Record<keyof EditableFields, string> = {
      first_name: "First Name",
      last_name: "Last Name",
      username: "Username",
      bio: "Bio",
      birth_date: "Birth Date",
      points: "Points",
      email: "Email",
      role: "Role",
    };

    (Object.keys(labels) as (keyof EditableFields)[]).forEach((key) => {
      const origVal = String(original[key]);
      const newVal = String(form[key]);
      if (origVal !== newVal) {
        changes.push({
          label: labels[key],
          from: origVal || "(empty)",
          to: newVal || "(empty)",
        });
      }
    });

    return changes;
  };

  const hasChanges = () => getChanges().length > 0;

  const handleSaveClick = () => {
    if (!hasChanges()) {
      toast.info("No changes to save");
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const dto: AdminUpdateProfileDTO = {};
      const changes = getChanges();

      changes.forEach(({ label }) => {
        switch (label) {
          case "First Name":
            dto.first_name = form.first_name;
            break;
          case "Last Name":
            dto.last_name = form.last_name;
            break;
          case "Username":
            dto.username = form.username;
            break;
          case "Bio":
            dto.bio = form.bio || null;
            break;
          case "Birth Date":
            dto.birth_date = form.birth_date;
            break;
          case "Points":
            dto.points = form.points;
            break;
          case "Email":
            dto.email = form.email;
            break;
          case "Role":
            dto.role = form.role;
            break;
        }
      });

      await updateAdminProfile(original.username, dto);
      toast.success("Profile updated successfully");
      setConfirmOpen(false);

      // If username changed, navigate to the new URL
      if (form.username !== original.username) {
        navigate(`/profiles/${form.username}`, { replace: true });
      } else {
        fetchProfile(form.username);
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      const message =
        error?.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof EditableFields>(
    key: K,
    value: EditableFields[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold">Profile Not Found</h2>
        <Button asChild>
          <Link to="/profiles">Go Back</Link>
        </Button>
      </div>
    );
  }

  const { profile, user } = data;
  const changes = getChanges();

  return (
    <div className="p-6 space-y-6 flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profiles">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-lg">
              {form.first_name[0] || "?"}
              {form.last_name[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">
              {form.first_name} {form.last_name}
            </h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <AtSign className="w-4 h-4 mr-1" />
              {form.username}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={form.role === "admin" ? "default" : "secondary"}
            className="text-sm px-3 py-1"
          >
            <Shield className="w-3.5 h-3.5 mr-1" />
            {form.role}
          </Badge>
          <Button
            onClick={handleSaveClick}
            disabled={!hasChanges() || saving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Points */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Points Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
              {form.points.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total accumulated points
            </p>
          </CardContent>
        </Card>

        {/* Account Created */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Account Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(user.created_at), "MMM d, yyyy")}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <Clock className="w-3 h-3 mr-1" />
              {format(new Date(user.created_at), "p")}
            </div>
          </CardContent>
        </Card>

        {/* Email Verification */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.email_verified_at ? (
                <span className="text-green-500">Verified</span>
              ) : (
                <span className="text-yellow-500">Unverified</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {user.email_verified_at
                ? `Verified on ${format(
                    new Date(user.email_verified_at),
                    "MMM d, yyyy"
                  )}`
                : "Email has not been verified yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="w-5 h-5 mr-2" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground flex items-center">
                  <Hash className="w-4 h-4 mr-2" />
                  Profile ID
                </span>
                <span className="font-mono">{profile.id}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) => updateField("first_name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) => updateField("last_name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center">
                  <AtSign className="w-3.5 h-3.5 mr-1" />
                  Username
                </Label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={(e) => updateField("username", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth_date" className="flex items-center">
                  <CalendarDays className="w-3.5 h-3.5 mr-1" />
                  Birth Date
                </Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={form.birth_date}
                  onChange={(e) => updateField("birth_date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="points" className="flex items-center">
                  <Trophy className="w-3.5 h-3.5 mr-1" />
                  Points
                </Label>
                <Input
                  id="points"
                  type="number"
                  min={0}
                  value={form.points}
                  onChange={(e) =>
                    updateField("points", parseInt(e.target.value) || 0)
                  }
                />
              </div>
            </div>

            {/* Bio Section */}
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="bio" className="flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1" />
                Bio
              </Label>
              <textarea
                id="bio"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                placeholder="No bio set..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="w-5 h-5 mr-2" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground flex items-center">
                <Hash className="w-4 h-4 mr-2" />
                User ID
              </span>
              <span className="font-mono">{user.id}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="w-3.5 h-3.5 mr-1" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between border rounded-lg p-4">
              <div className="space-y-1">
                <Label
                  htmlFor="role-switch"
                  className="flex items-center text-sm font-medium"
                >
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  Admin Role
                </Label>
                <p className="text-xs text-muted-foreground">
                  {form.role === "admin"
                    ? "This user has admin privileges"
                    : "This user has standard privileges"}
                </p>
              </div>
              <Switch
                id="role-switch"
                checked={form.role === "admin"}
                onCheckedChange={(checked) =>
                  updateField("role", checked ? "admin" : "user")
                }
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Verified
                </span>
                <span className="font-medium">
                  {user.email_verified_at
                    ? format(
                        new Date(user.email_verified_at),
                        "MMM d, yyyy 'at' p"
                      )
                    : "Not verified"}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Account Created
                </span>
                <span className="font-medium">
                  {format(new Date(user.created_at), "MMM d, yyyy 'at' p")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Last Updated
                </span>
                <span className="font-medium">
                  {format(new Date(user.updated_at), "MMM d, yyyy 'at' p")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <CalendarDays className="w-5 h-5 mr-2" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">
                Profile Created
              </span>
              <p className="font-medium">
                {format(new Date(profile.created_at), "MMMM d, yyyy 'at' p")}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">
                Profile Updated
              </span>
              <p className="font-medium">
                {format(new Date(profile.updated_at), "MMMM d, yyyy 'at' p")}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">
                Account Created
              </span>
              <p className="font-medium">
                {format(new Date(user.created_at), "MMMM d, yyyy 'at' p")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to make the following changes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 my-2">
            {changes.map((change, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm border rounded-lg p-3 bg-muted/30"
              >
                <span className="font-medium min-w-[90px]">
                  {change.label}:
                </span>
                <span className="text-red-500 line-through">{change.from}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-green-500">{change.to}</span>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave} disabled={saving}>
              {saving ? "Saving..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
