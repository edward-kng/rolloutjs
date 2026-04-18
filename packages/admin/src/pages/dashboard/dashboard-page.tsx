import { DashboardCard } from "@/components/dashboard/dashboard-card";
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
      title="RolloutJS Admin"
      description="Manage your feature flags, segments and overrides"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <DashboardCard
            title="Flags"
            icon={Flag}
            value={flags.length}
            description={
              <>
                {enabledBooleanFlags?.length} of {booleanFlags?.length} boolean
                flags enabled
              </>
            }
          />
          <DashboardCard
            title="Segments"
            icon={PieChart}
            value={segments.length}
            description="User segments defined"
          />
          <DashboardCard
            title="Overrides"
            icon={ChevronsRight}
            value={overrides.length}
            description="Active flag overrides"
          />
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
