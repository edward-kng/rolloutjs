import FlagsTable from "../../components/flags/flags-table";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import FlagEditor from "../../components/flags/editor/flag-editor";
import { useState } from "react";

export default function FlagsPage() {
  const queryParams = new URLSearchParams(window.location.search);

  const [isCreating, setIsCreating] = useState(
    queryParams.get("create") === "true",
  );

  if (isCreating) {
    return (
      <PageLayout title="Create Flag" description="Create a new feature flag">
        <FlagEditor onClose={() => setIsCreating(false)} />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Flags"
      description="Manage your feature flags"
      actions={
        <Button onClick={() => setIsCreating(true)}>
          <PlusIcon />
          Create Flag
        </Button>
      }
    >
      <FlagsTable />
    </PageLayout>
  );
}
