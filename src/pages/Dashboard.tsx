import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Boxes, History, MapPin, Trophy, Users } from "lucide-react";
import { getAdminDashboard, type AdminDashboard } from "@/services/dashboard-endpoints";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const stats = [
  { label: "Profiles", key: "profiles_count", to: "/profiles", icon: Users },
  { label: "Recycling sessions", key: "sessions_count", to: "/recycling-sessions", icon: History },
  { label: "Recycling bins", key: "bins_count", to: "/recycling-bins", icon: MapPin },
  { label: "Recyclable items", key: "items_count", to: "/recyclable-items", icon: Boxes },
] as const;

export default function Dashboard() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    setError(false);
    try {
      setData(await getAdminDashboard());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const leadingCategory = data?.top_categories[0];

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">A quick look at your recycling community.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            Could not load dashboard statistics.
            <Button variant="outline" size="sm" onClick={loadDashboard}>Try again</Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, key, to, icon: Icon }) => (
          <Link key={key} to={to} className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Card className="h-full gap-3 transition-colors hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-9 w-16" /> : (
                  <div className="text-3xl font-bold">{data && !error ? data[key].toLocaleString() : "—"}</div>
                )}
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  View all <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" /> Most scanned categories</CardTitle>
            <CardDescription>Top five categories by accepted scans · All time</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-40 w-full" /> : error ? (
              <p className="text-sm text-muted-foreground">Category statistics are unavailable.</p>
            ) : leadingCategory && data ? (
              <div className="space-y-6">
                <div className="rounded-lg border bg-muted/40 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Most recycled</p>
                  <p className="mt-1 text-2xl font-semibold break-words">{leadingCategory.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {leadingCategory.scan_count.toLocaleString()} accepted scans · {Math.round(leadingCategory.scan_count / data.accepted_scans_count * 100)}% of all accepted scans
                  </p>
                </div>
                <ol className="space-y-4">
                  {data.top_categories.map((category, index) => (
                    <li key={category.id} className="space-y-2">
                      <div className="flex justify-between gap-4 text-sm">
                        <span className="min-w-0 break-words"><span className="mr-2 text-muted-foreground">{index + 1}.</span>{category.name}</span>
                        <span className="shrink-0 font-medium">{category.scan_count.toLocaleString()} scans</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${category.scan_count / leadingCategory.scan_count * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <p className="py-6 text-sm text-muted-foreground">No accepted scans yet. Categories will appear here as items are recycled.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick navigation</CardTitle>
            <CardDescription>Jump straight to the admin tools.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild><Link to="/recycling-sessions">View recycling sessions <ArrowUpRight aria-hidden="true" /></Link></Button>
            <Button asChild variant="outline"><Link to="/recyclable-item-categories">Manage categories <ArrowUpRight aria-hidden="true" /></Link></Button>
            <Button asChild variant="outline"><Link to="/recyclable-items/create">Create recyclable item <ArrowUpRight aria-hidden="true" /></Link></Button>
            <Button asChild variant="outline"><Link to="/recycling-bins">Manage recycling bins <ArrowUpRight aria-hidden="true" /></Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
