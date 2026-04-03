import { Route, Routes } from "react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ROUTES } from "@/constants/routes";
import FlagsPage from "./flags/FlagsPage";
import FlagEditorPage from "./flags/editor/FlagEditorPage";
import DashboardPage from "./dashboard/DashboardPage";
import SegmentsPage from "./segments/SegmentsPage";
import SegmentEditorPage from "./segments/editor/SegmentEditorPage";

export default function Root() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Routes>
          <Route path={ROUTES.ROOT} element={<DashboardPage />} />
          <Route path={ROUTES.FLAGS} element={<FlagsPage />} />
          <Route path={ROUTES.FLAGS_FLAG_KEY} element={<FlagEditorPage />} />
          <Route path={ROUTES.SEGMENTS} element={<SegmentsPage />} />
          <Route
            path={ROUTES.SEGMENTS_SEGMENT_KEY}
            element={<SegmentEditorPage />}
          />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}
