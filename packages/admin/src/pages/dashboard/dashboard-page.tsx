import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/constants/routes";
import { useFlags } from "@/hooks/api/useFlags";
import { useOverrides } from "@/hooks/api/useOverrides";
import { useSegments } from "@/hooks/api/useSegments";
import { inferType } from "@/utils/flags";
import { ArrowRight, ChevronsRight, Flag, PieChart, Plus } from "lucide-react";
import { createSearchParams, useNavigate } from "react-router";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data: flags, isPending: isLoadingFlags } = useFlags();
  const { data: overrides, isPending: isLoadingOverrides } = useOverrides();
  const { data: segments, isPending: isLoadingSegments } = useSegments();

  const booleanFlags = flags?.filter(
    (flag) => inferType(flag.defaultValue) === "boolean",
  );
  const enabledBooleanFlags = booleanFlags?.filter((flag) => flag.defaultValue);

  if (
    isLoadingFlags ||
    isLoadingOverrides ||
    isLoadingSegments ||
    !flags ||
    !overrides ||
    !segments
  ) {
    return <Spinner />;
  }

  return (
    <PageLayout
      title="LibreFlag.js Admin"
      description="Manage your feature flags, segments and overrides"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Flags</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{flags.length}</div>
              <p className="text-xs text-muted-foreground">
                {enabledBooleanFlags?.length} of {booleanFlags?.length} boolean
                flags enabled
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Segments</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{segments?.length}</div>
              <p className="text-xs text-muted-foreground">
                User segments defined
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overrides</CardTitle>
              <ChevronsRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overrides?.length}</div>
              <p className="text-xs text-muted-foreground">
                Active flag overrides
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Create flags and segments to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button
              onClick={() =>
                navigate({
                  pathname: ROUTES.FLAGS,
                  search: createSearchParams({
                    create: "true",
                  }).toString(),
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              New Flag
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                navigate({
                  pathname: ROUTES.SEGMENTS,
                  search: createSearchParams({
                    create: "true",
                  }).toString(),
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              New Segment
            </Button>
            <Button variant="outline" onClick={() => navigate(ROUTES.FLAGS)}>
              View All Flags
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
