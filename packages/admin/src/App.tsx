import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ROUTES } from "./constants/routes";
import { ThemeProvider } from "./components/theme-provider";
import Root from "./pages/root";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={ROUTES.BASE}>
        <ThemeProvider>
          <TooltipProvider>
            <Routes>
              <Route path={ROUTES.ROOT} element={<Root />} />
            </Routes>
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
