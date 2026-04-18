import PageLayout from "@/components/page-layout";
import { useNavigate, useParams } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/constants/routes";
import { useSegments } from "@/hooks/api/useSegments";
import SegmentEditor from "@/components/segments/editor/segment-editor";

export default function SegmentEditorPage() {
  const { segmentKey } = useParams();
  const navigate = useNavigate();

  const { data: segments, isPending: isLoadingSegments } = useSegments();

  const segment = segments?.find((s) => s.key === segmentKey);

  if (isLoadingSegments || !segment) {
    return <Spinner />;
  }

  return (
    <PageLayout title={`Edit: ${segment.key}`} description="Edit this segment">
      <SegmentEditor
        segment={segment}
        onClose={() => navigate(ROUTES.SEGMENTS)}
        key={segment.key}
      />
    </PageLayout>
  );
}
