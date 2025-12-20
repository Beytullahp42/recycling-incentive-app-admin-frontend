import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-9xl font-extrabold tracking-widest text-primary">
        404
      </h1>
      <div className="bg-destructive text-destructive-foreground px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <div className="mt-5">
        <p className="text-lg text-muted-foreground mb-8 text-center">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex justify-center">
          <Button onClick={() => navigate("/")} variant="default" size="lg">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
