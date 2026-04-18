import { Route, Routes } from "react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ROUTES } from "@/constants/routes";
import FlagsPage from "./flags/flags-page";
import FlagEditorPage from "./flags/editor/flag-editor-page";
import DashboardPage from "./dashboard/dashboard-page";
import SegmentsPage from "./segments/segments-page";
import SegmentEditorPage from "./segments/editor/segment-editor-page";

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
