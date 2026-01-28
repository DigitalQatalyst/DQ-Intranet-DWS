import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "./components/Header";
import { MarketplaceRouter } from "./pages/marketplace/MarketplaceRouter";
import { CommunitiesRouter } from "./communities/CommunitiesRouter";
import { App } from './App';
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProtectedRouteWithAuthAndRole } from "./components/ProtectedRouteWithRole";

import MarketplaceDetailsPage from "./pages/marketplace/MarketplaceDetailsPage";
import LmsCourseDetailPage from "./pages/lms/LmsCourseDetailPage";
import LmsCourseReviewsPage from "./pages/lms/LmsCourseReviewsPage";
import LmsLessonPage from "./pages/lms/LmsLessonPage";
import LmsCourseAssessmentPage from "./pages/lms/LmsCourseAssessmentPage";
import MyLearningDashboard from "./pages/lms/MyLearningDashboard";

// Wrapper component to force remount on slug change
const LmsCourseDetailPageWrapper = () => {
  const { slug } = useParams<{ slug: string }>();
  return <LmsCourseDetailPage key={slug} />;
};
import LmsCourses from "./pages/LmsCourses";
import AssetLibraryPage from "./pages/assetLibrary";
import BlueprintsPage from "./pages/blueprints";
import DQAgileKPIsPage from "./pages/play/DQAgileKPIsPage";
import DashboardRouter from "./pages/dashboard/DashboardRouter";
import DiscoverDQ from "./pages/DiscoverDQ";
import ComingSoonPage from "./pages/ComingSoonPage";
import GrowthSectorsComingSoon from "./pages/GrowthSectorsComingSoon";
import NotFound from "./pages/NotFound";
import AdminGuidesList from "./pages/admin/guides/AdminGuidesList";
import GuideEditor from "./pages/admin/guides/GuideEditor";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import EventsPage from "./pages/events/EventsPage";
import ChatBot from "./bot/ChatBot";
import ThankYou from "./pages/ThankYou";
import UnitProfilePage from "./pages/UnitProfilePage";
import WorkPositionProfilePage from "./pages/WorkPositionProfilePage";
import RoleProfilePage from "./pages/RoleProfilePage";
import WomenEntrepreneursPage from "./pages/WomenEntrepreneursPage";
import SignInPage from "./pages/SignInPage";

export function AppRouter() {

  const client = new ApolloClient({
    link: new HttpLink({
      uri: "https://9609a7336af8.ngrok-free.app/services-api",
    }), // <-- Use HttpLink
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <ChatBot />
          <Routes>
            <Route path="/discover-dq" element={<DiscoverDQ />} />
            <Route path="/coming-soon" element={<ComingSoonPage />} />
            <Route path="/growth-sectors-coming-soon" element={<GrowthSectorsComingSoon />} />
            <Route path="/*" element={<App />} />
            <Route path="/courses/:itemId" element={<LmsCourseDetailPage />} />
            <Route path="/lms" element={<LmsCourses />} />
            <Route path="/lms/my-learning" element={<MyLearningDashboard />} />
            <Route path="/lms/:courseSlug/lesson/:lessonId" element={<LmsLessonPage />} />
            <Route path="/lms/:slug/reviews" element={<LmsCourseReviewsPage />} />
            <Route path="/lms/:slug/assessment" element={<LmsCourseAssessmentPage />} />
            <Route
              path="/lms/:slug"
              element={<LmsCourseDetailPageWrapper />}
            />
            <Route
              path="/onboarding/:itemId"
              element={
                <ProtectedRoute>
                  <MarketplaceDetailsPage marketplaceType="onboarding" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/:itemId/details"
              element={
                <ProtectedRoute>
                  <MarketplaceDetailsPage marketplaceType="onboarding" />
                </ProtectedRoute>
              }
            />
            {/* Marketplace routes - authenticated access per spec Section 4 */}
            <Route
              path="/marketplace/*"
              element={
                <ProtectedRoute>
                  <MarketplaceRouter />
                </ProtectedRoute>
              }
            />
            {/* Future: /knowledge/manage/** requires content_publisher role */}
            {/* Future: /media/admin/** requires content_publisher role */}
            {/* Future: /services/manage/** requires service_owner role */}
            {/* Admin - Guides CRUD (requires system_admin role per spec) */}
            <Route
              path="/admin/guides"
              element={
                <ProtectedRouteWithAuthAndRole requiredRole="system_admin">
                  <AdminGuidesList />
                </ProtectedRouteWithAuthAndRole>
              }
            />
            <Route
              path="/admin/guides/new"
              element={
                <ProtectedRouteWithAuthAndRole requiredRole="system_admin">
                  <GuideEditor />
                </ProtectedRouteWithAuthAndRole>
              }
            />
            <Route
              path="/admin/guides/:id"
              element={
                <ProtectedRouteWithAuthAndRole requiredRole="system_admin">
                  <GuideEditor />
                </ProtectedRouteWithAuthAndRole>
              }
            />
            {/* Admin routes - all require system_admin role per spec Section 4 */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRouteWithAuthAndRole requiredRole="system_admin">
                  <NotFound />
                </ProtectedRouteWithAuthAndRole>
              }
            />
            {/* Canonical and compatibility routes for Guides marketplace */}
            <Route
              path="/guides"
              element={
                <ProtectedRoute>
                  <Navigate to="/marketplace/guides" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/knowledge-hub"
              element={
                <ProtectedRoute>
                  <Navigate to="/marketplace/guides" replace />
                </ProtectedRoute>
              }
            />
            <Route path="/marketplace/*" element={<MarketplaceRouter />} />
            {/* Admin - Guides CRUD */}
            <Route path="/admin/guides" element={<AdminGuidesList />} />
            <Route path="/admin/guides/new" element={<GuideEditor />} />
            <Route path="/admin/guides/:id" element={<GuideEditor />} />
            {/* Canonical and compatibility routes for Guides marketplace */}
            <Route path="/guides" element={<Navigate to="/marketplace/guides" replace />} />
            <Route path="/knowledge-hub" element={<Navigate to="/marketplace/guides" replace />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/asset-library"
              element={
                <ProtectedRoute>
                  <AssetLibraryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blueprints"
              element={
                <ProtectedRoute>
                  <BlueprintsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blueprints/:projectId"
              element={
                <ProtectedRoute>
                  <BlueprintsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blueprints/:projectId/:folderId"
              element={
                <ProtectedRoute>
                  <BlueprintsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/play/dq-agile-kpis"
              element={
                <ProtectedRoute>
                  <DQAgileKPIsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/thank-you"
              element={
                <ProtectedRoute>
                  <ThankYou />
                </ProtectedRoute>
              }
            />
            {/* Redirect encoded leading-space path to canonical route */}
            <Route
              path="/%20marketplace/news"
              element={
                <ProtectedRoute>
                  <Navigate to="/marketplace/news" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventsPage />
                </ProtectedRoute>
              }
            />
            {/* Communities routes - authenticated access per spec Section 4 */}
            <Route
              path="/communities/*"
              element={
                <ProtectedRoute>
                  <CommunitiesRouter />
                </ProtectedRoute>
              }
            />
            {/* Future: /communities/moderation/** requires moderator role */}
            {/* Future: /directory/manage/** requires directory_maintainer role */}
            {/* Work Directory Routes */}
            <Route
              path="/work-directory/units/:slug"
              element={
                <ProtectedRoute>
                  <UnitProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/work-directory/positions/:slug"
              element={
                <ProtectedRoute>
                  <WorkPositionProfilePage />
                </ProtectedRoute>
              }
            />
            {/* Role Profile Route */}
            <Route
              path="/roles/:slug"
              element={
                <ProtectedRoute>
                  <RoleProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/women-entrepreneurs"
              element={
                <ProtectedRoute>
                  <WomenEntrepreneursPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/404"
              element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirects to sign-in if not authenticated */}
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}
