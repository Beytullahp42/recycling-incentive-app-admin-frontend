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

import { getProfiles } from "@/services/profiles-endpoints";
import { Profile } from "@/models/Profile";
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
  User,
  CalendarDays,
  AtSign,
  Trophy,
} from "lucide-react";
import { format } from "date-fns";

export default function Profiles() {
  const [data, setData] = useState<PaginatedResponse<Profile> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProfiles(page);
  }, [page]);

  const fetchProfiles = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await getProfiles(pageNumber);
      setData(response);
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold">Profiles</h1>
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
          {data?.data.map((profile) => (
            <Card
              key={profile.id}
              className="overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <CardHeader className="bg-muted/10">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <span>{profile.fullName}</span>
                    </CardTitle>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <AtSign className="w-3.5 h-3.5 mr-1" />
                      <span>{profile.username}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm font-medium px-2 py-1 rounded-full bg-background border text-primary">
                    <Trophy className="w-4 h-4 mr-1" />
                    <span>{profile.points.toLocaleString()} pts</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-4 flex-1">
                {/* Bio */}
                {profile.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {profile.bio}
                  </p>
                )}

                {/* Profile Details */}
                <div className="space-y-2 pt-4 border-t text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-muted-foreground">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      Birth Date
                    </span>
                    <span className="font-medium">
                      {format(new Date(profile.birth_date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-muted-foreground">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      Joined
                    </span>
                    <span className="font-medium">
                      {format(new Date(profile.created_at), "MMM d, yyyy")}
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
                  <Link to={`/profiles/${profile.username}`}>
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
