import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login, getCurrentUser } from "@/services/auth-endpoints";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const formSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser();
        if (user && user.role === "admin") {
          navigate("/", { replace: true });
        }
      } catch (e) {
        // User is not logged in, stay on login page
      }
    }
    checkAuth();
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setLoading(true);
    try {
      const success = await login(values.email, values.password);
      if (success) {
        navigate("/");
      }
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      console.error("Login error:", error);
      setError(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Show demo admin credentials"
              title="Demo credentials"
            >
              <span aria-hidden="true" className="text-base font-semibold">
                ?
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Demo admin credentials</DialogTitle>
              <DialogDescription>
                Use these credentials reasonably for demo purposes.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="rounded-md border bg-muted/40 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-muted-foreground">
                    Email
                  </span>
                  <code className="rounded bg-background px-2 py-1 font-mono text-sm">
                    admin@recycling.com
                  </code>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="font-medium text-muted-foreground">
                    Password
                  </span>
                  <code className="rounded bg-background px-2 py-1 font-mono text-sm">
                    password
                  </code>
                </div>
              </div>
              <p className="text-muted-foreground">
                The whole app, database, and persistent volumes are reset every
                24 hours.
              </p>
            </div>
          </DialogContent>
        </Dialog>
        <ModeToggle />
      </div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-zinc-950 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
