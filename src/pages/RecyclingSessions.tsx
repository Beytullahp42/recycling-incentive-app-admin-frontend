import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getRecyclingSessions } from "@/services/recycling-sessions-endpoints";
import { RecyclingSession } from "@/models/RecyclingSession";
import type { PaginatedResponse } from "@/models/PaginatedResponse";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  History,
  QrCode,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";

export default function RecyclingSessions() {
  const [data, setData] = useState<PaginatedResponse<RecyclingSession> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchSessions(page);
  }, [page]);

  const fetchSessions = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await getRecyclingSessions(pageNumber);
      setData(response);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
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

  // Helper to generate page numbers
  const renderPaginationItems = () => {
    if (!data) return null;
    const { current_page, last_page } = data;
    const items = [];

    // Previous Button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (current_page > 1) setPage(current_page - 1);
          }}
          className={
            current_page <= 1
              ? "pointer-events-none opacity-50"
              : "cursor-pointer"
          }
        />
      </PaginationItem>
    );

    // Page Numbers
    const pageNumbers: (number | string)[] = [];
    if (last_page <= 7) {
      for (let i = 1; i <= last_page; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (current_page > 3) pageNumbers.push("ellipsis-1");

      const start = Math.max(2, current_page - 1);
      const end = Math.min(last_page - 1, current_page + 1);

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (current_page < last_page - 2) pageNumbers.push("ellipsis-2");
      pageNumbers.push(last_page);
    }

    pageNumbers.forEach((pageNum, index) => {
      if (typeof pageNum === "string") {
        items.push(
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        items.push(
          <PaginationItem key={pageNum}>
            <PaginationLink
              href="#"
              isActive={pageNum === current_page}
              onClick={(e) => {
                e.preventDefault();
                setPage(pageNum as number);
              }}
              className="cursor-pointer"
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        );
      }
    });

    // Next Button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (current_page < last_page) setPage(current_page + 1);
          }}
          className={
            current_page >= last_page
              ? "pointer-events-none opacity-50"
              : "cursor-pointer"
          }
        />
      </PaginationItem>
    );

    return items;
  };

  return (
    <div className="p-6 space-y-6 flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recycling Sessions</h1>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-3 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.data.map((session) => (
            <Card
              key={session.id}
              className="overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <CardHeader className="bg-muted/10">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="font-mono bg-muted px-2 py-0.5 rounded text-sm">
                        #{session.id}
                      </span>
                      <span className="text-muted-foreground text-sm font-normal flex items-center">
                        <CalendarDays className="w-4 h-4 mr-1" />
                        {format(new Date(session.created_at), "MMM d, HH:mm")}
                      </span>
                    </CardTitle>
                  </div>
                  <div
                    className={`flex items-center text-sm font-medium px-2 py-1 rounded-full bg-background border ${getStatusColor(
                      session.audit_status
                    )}`}
                  >
                    <span className="capitalize">{session.audit_status}</span>
                    {getStatusIcon(session.audit_status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-4 flex-1">
                {/* User Info */}
                <div className="flex flex-col space-y-1">
                  {session.user.profile ? (
                    <>
                      <span className="font-semibold text-lg leading-none">
                        {session.user.profile.fullName}
                      </span>
                      <div className="flex items-center text-muted-foreground text-sm space-x-2">
                        <span>@{session.user.profile.username}</span>
                        <span>•</span>
                        <span className="truncate">{session.user.email}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg">
                        User #{session.user_id}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {session.user.email}
                      </span>
                    </div>
                  )}
                </div>

                {/* Points Breakdown */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center p-2 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20">
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wider">
                      Accepted
                    </span>
                    <span className="font-bold text-lg text-green-700 dark:text-green-300">
                      {session.accepted_points.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium uppercase tracking-wider">
                      Flagged
                    </span>
                    <span className="font-bold text-lg text-yellow-700 dark:text-yellow-300">
                      {session.flagged_points.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium uppercase tracking-wider">
                      Rejected
                    </span>
                    <span className="font-bold text-lg text-red-700 dark:text-red-300">
                      {session.rejected_points.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Session Details */}
                <div className="space-y-2 pt-4 border-t text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      Bin
                    </span>
                    <span
                      className="font-medium truncate max-w-[150px]"
                      title={session.bin?.name}
                    >
                      {session.bin?.name || `ID: ${session.recycling_bin_id}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-muted-foreground">
                      <QrCode className="w-4 h-4 mr-2" />
                      Items Scanned
                    </span>
                    <span className="font-medium">
                      {session.transactions_count ??
                        session.transactions?.length ??
                        0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-muted-foreground">
                      <History className="w-4 h-4 mr-2" />
                      Status
                    </span>
                    <span className="capitalize font-medium">
                      {session.lifecycle_status}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-sm h-9 bg-background"
                  asChild
                >
                  <Link to={`/recycling-sessions/${session.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && (
        <div className="mt-auto pt-4">
          <Pagination>
            <PaginationContent>{renderPaginationItems()}</PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
