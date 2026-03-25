import { Route, Routes } from "react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ROUTES } from "@/constants/routes";
import FlagsPage from "./flags/FlagsPage";

export default function Root() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Routes>
          <Route path={ROUTES.ROOT} element={<FlagsPage />} />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}
