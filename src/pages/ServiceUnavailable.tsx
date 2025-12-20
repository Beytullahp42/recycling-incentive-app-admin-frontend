import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function ServiceUnavailable() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-destructive/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            Service Unavailable
          </CardTitle>
          <CardDescription className="text-balance pt-2">
            We are having trouble connecting to the server. Please try again
            later.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <Button onClick={handleRetry} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
