import { Route, Routes } from "react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ROUTES } from "@/constants/routes";
import FlagsPage from "./flags/FlagsPage";
import UsersPage from "./users/UsersPage";

export default function Root() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Routes>
          <Route path={ROUTES.FLAGS} element={<FlagsPage />} />
          <Route path={ROUTES.USERS} element={<UsersPage />} />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}
