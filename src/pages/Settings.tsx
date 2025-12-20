import { useTheme } from "@/components/theme-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { Moon, Sun, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateEmail, getCurrentUser } from "@/services/auth-endpoints";

const emailSchema = z.object({
  email: z.email("Invalid email address"),
});

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [loadingEmail, setLoadingEmail] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    setValue: setEmailValue,
  } = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  });

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      if (user) {
        setEmailValue("email", user.email);
      }
    }
    loadUser();
  }, [setEmailValue]);

  const onUpdateEmail = async (values: z.infer<typeof emailSchema>) => {
    setLoadingEmail(true);
    try {
      await updateEmail(values.email);
      toast.success("Email updated successfully");
    } catch (error: any) {
      console.error("Failed to update email", error);
      if (error.response?.data?.errors?.email) {
        toast.error(error.response.data.errors.email[0]);
      } else {
        toast.error("Failed to update email");
      }
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account details and security.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            onSubmit={handleSubmitEmail(onUpdateEmail)}
            className="space-y-4 max-w-md"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-4">
                <Input
                  id="email"
                  {...registerEmail("email")}
                  placeholder="your@email.com"
                />
                <Button type="submit" disabled={loadingEmail}>
                  {loadingEmail ? "Saving..." : "Update Email"}
                </Button>
              </div>
              {emailErrors.email && (
                <span className="text-red-500 text-sm">
                  {emailErrors.email.message}
                </span>
              )}
            </div>
          </form>

          <div className="pt-4 border-t">
            <Label className="block mb-4">Password</Label>
            <ChangePasswordModal />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="flex gap-4 pt-2">
              <Button
                variant="outline"
                className={cn(
                  "gap-2",
                  theme === "light" && "border-primary border-2"
                )}
                onClick={() => setTheme("light")}
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "gap-2",
                  theme === "dark" && "border-primary border-2"
                )}
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "gap-2",
                  theme === "system" && "border-primary border-2"
                )}
                onClick={() => setTheme("system")}
              >
                <Laptop className="h-4 w-4" />
                System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
