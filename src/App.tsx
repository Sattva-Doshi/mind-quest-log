import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getUser } from "./lib/storage";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import ScreenTime from "./pages/ScreenTime";
import CalendarView from "./pages/CalendarView";
import Insights from "./pages/Insights";
import BottomNav from "./components/BottomNav";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getUser();
  return user?.onboarded ? <>{children}</> : <Navigate to="/" replace />;
};

const App = () => {
  const user = getUser();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={user?.onboarded ? <Navigate to="/dashboard" replace /> : <Onboarding />} 
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                  <BottomNav />
                </ProtectedRoute>
              }
            />
            <Route
              path="/habits"
              element={
                <ProtectedRoute>
                  <Habits />
                  <BottomNav />
                </ProtectedRoute>
              }
            />
            <Route
              path="/screen-time"
              element={
                <ProtectedRoute>
                  <ScreenTime />
                  <BottomNav />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarView />
                  <BottomNav />
                </ProtectedRoute>
              }
            />
            <Route
              path="/insights"
              element={
                <ProtectedRoute>
                  <Insights />
                  <BottomNav />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
