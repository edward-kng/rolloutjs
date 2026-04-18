import PageLayout from "@/components/page-layout";
import FlagEditor from "./flag-editor";
import { useFlags } from "@/hooks/api/useFlags";
import { useNavigate, useParams } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/constants/routes";

export default function FlagEditorPage() {
  const { flagKey } = useParams();
  const navigate = useNavigate();

  const { data: flags, isPending: isLoadingFlags } = useFlags();

  const flag = flags?.find((f) => f.key === flagKey);

  if (isLoadingFlags || !flag) {
    return <Spinner />;
  }

  return (
    <PageLayout
      title={`Edit: ${flag.key}`}
      description="Edit this feature flag"
    >
      <FlagEditor
        flag={flag}
        onClose={() => navigate(ROUTES.FLAGS)}
        key={flag.key}
      />
    </PageLayout>
  );
}
