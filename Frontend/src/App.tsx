import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.tsx'
import { dashboardPath } from './context/authHelpers.ts'
import ProtectedRoute from './routes/ProtectedRoute.tsx'

import LoadingScreen from './components/shared/LoadingScreen.tsx'
import LandingPage from './pages/landing/LandingPage.tsx'
import CreateAccount from './pages/auth/RoleSelection.tsx'
import ClientRegistration from './pages/auth/ClientSignUp.tsx'
import ContractorRegistration from './pages/auth/ContractorSignUp.tsx'
import SupplierRegistration from './pages/auth/SupplierSignUp.tsx'
import SignIn from './pages/auth/SignIn.tsx'
import AccountCreated from './pages/auth/AccountCreated.tsx'
import ForgotPassword from './pages/auth/ForgotPassword.tsx'
import TermsPage from './pages/legal/TermsPage.tsx'
import PrivacyPage from './pages/legal/PrivacyPage.tsx'

import DashboardEmpty from './pages/client/ClientDashboard.tsx'
import ProjectDetail from './pages/client/ProjectDetail.tsx'
import ProjectOverview from './pages/client/ProjectOverview.tsx'
import ProductDetail from './pages/client/ProductDetail.tsx'
import Milestones from './pages/client/MilestoneDetail.tsx'
import SingleMilestone from './pages/client/SingleMilestone.tsx'
import PaymentsEmpty from './pages/client/PaymentsScreen.tsx'
import Talents from './pages/client/TalentsPage.tsx'
import TalentProfile from './pages/client/TalentProfile.tsx'
import SendMoney from './pages/client/SendMoney.tsx'

import ContractorDashboard from './pages/contractor/ContractorDashboard.tsx'
import ContractorProfileSetup from './pages/contractor/ContractorProfileSetup.tsx'
import PostServicePage from './pages/contractor/PostServicePage.tsx'

import SupplierDashboard from './pages/supplier/SupplierDashboard.tsx'
import SupplierProfileSetup from './pages/supplier/SupplierProfileSetup.tsx'

// ── /dashboard → redirect to the user's own dashboard ────────────────────────
function DashboardRedirect() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <LoadingScreen />
  if (!user) return <Navigate to="/signin" replace />
  return <Navigate to={dashboardPath(user.role)} replace />
}

// ── Root app shell (needs AuthContext already mounted) ────────────────────────
function AppShell() {
  const { isLoading } = useAuth()

  // Show loading screen while session is being rehydrated
  if (isLoading) return <LoadingScreen />

  return (
    <Routes>
      {/* ── Public routes ────────────────────────────────────────── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/create-account/client" element={<ClientRegistration />} />
      <Route path="/create-account/contractor" element={<ContractorRegistration />} />
      <Route path="/create-account/supplier" element={<SupplierRegistration />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/account-created" element={<AccountCreated />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* ── Smart /dashboard redirect ─────────────────────────────── */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* ── Client routes ────────────────────────────────────────── */}
      <Route path="/dashboard/client" element={
        <ProtectedRoute role="client"><DashboardEmpty /></ProtectedRoute>
      } />
      <Route path="/dashboard/client/talents/:talentId" element={
        <ProtectedRoute role="client"><TalentProfile /></ProtectedRoute>
      } />
      <Route path="/dashboard/client/send-money" element={
        <ProtectedRoute role="client"><SendMoney /></ProtectedRoute>
      } />
      <Route path="/dashboard/client/marketplace/product/:id" element={
        <ProtectedRoute role="client"><ProductDetail /></ProtectedRoute>
      } />
      <Route path="/dashboard/client/project/:id" element={
        <ProtectedRoute role="client"><ProjectDetail /></ProtectedRoute>
      }>
        <Route index element={<ProjectOverview />} />
        <Route path="milestones" element={<Milestones />} />
        <Route path="milestones/:milestoneId" element={<SingleMilestone />} />
        <Route path="payments" element={<PaymentsEmpty />} />
        <Route path="payments/send-money" element={<SendMoney />} />
        <Route path="talents" element={<Talents />} />
        <Route path="talents/:talentId" element={<TalentProfile />} />
      </Route>

      {/* ── Contractor routes ─────────────────────────────────────── */}
      <Route path="/dashboard/contractor" element={
        <ProtectedRoute role="contractor"><ContractorDashboard /></ProtectedRoute>
      } />
      <Route path="/dashboard/contractor/offer-service" element={
        <ProtectedRoute role="contractor"><PostServicePage /></ProtectedRoute>
      } />
      <Route path="/dashboard/contractor/profile-setup" element={
        <ProtectedRoute role="contractor"><ContractorProfileSetup /></ProtectedRoute>
      } />

      {/* ── Supplier routes ───────────────────────────────────────── */}
      <Route path="/dashboard/supplier" element={
        <ProtectedRoute role="supplier"><SupplierDashboard /></ProtectedRoute>
      } />
      <Route path="/dashboard/supplier/profile-setup" element={
        <ProtectedRoute role="supplier"><SupplierProfileSetup /></ProtectedRoute>
      } />

      {/* ── 404 catch-all ─────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// ── App root ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
