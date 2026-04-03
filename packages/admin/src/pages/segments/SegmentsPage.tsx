import { useState } from "react";
import SegmentsTable from "./SegmentsTable";
import PageLayout from "@/components/PageLayout";
import SegmentEditor from "./editor/SegmentEditor";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SegmentsPage() {
  const queryParams = new URLSearchParams(window.location.search);

  const [isCreating, setIsCreating] = useState(
    queryParams.get("create") === "true",
  );

  if (isCreating) {
    return (
      <PageLayout
        title="Create Segment"
        description="Create a new user segment"
      >
        <SegmentEditor onClose={() => setIsCreating(false)} />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Segments"
      description="Manage your user segments"
      actions={
        <Button onClick={() => setIsCreating(true)}>
          <PlusIcon />
          Create Segment
        </Button>
      }
    >
      <SegmentsTable />
    </PageLayout>
  );
}
