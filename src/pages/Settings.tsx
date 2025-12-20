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
import { Moon, Sun, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
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
    </div>
  );
}
