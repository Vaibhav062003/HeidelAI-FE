// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import { AuthProvider, useAuth } from './contexts/AuthContext';

// // Pages
// import Home from '@/app/(main)/page';
// import LoginPage from '@/app/login/page';
// import AdminSignup from '@/pages/AdminSignup';
// import CompanyInfo from './app/company-info/CompanyInfo';
// import IndustrySelection from '@/pages/IndustrySelection';
// // import DomainConnection from './pages/DomainConnection';
// // import GoogleIntegration from './pages/GoogleIntegration';
// // import ProductURL from './pages/ProductURL';
// // import Dashboard from './pages/Dashboard';
// // import InviteTeam from './pages/InviteTeam';
// import AgentSignup from '@/pages/AgentSignup';

// interface ProtectedRouteProps {
//   requireAdmin?: boolean;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
//   const { user, userDetails } = useAuth();
  
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
  
//   if (requireAdmin && userDetails?.role !== 'admin') {
//     return <Navigate to="/dashboard" replace />;
//   }
  
//   return <Outlet />;
// };

// const App: React.FC = () => {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/admin-signup" element={<AdminSignup />} />
//           <Route path="/agent-signup/:token" element={<AgentSignup />} />
          
//           {/* Protected routes that anyone authenticated can access */}
//           {/* <Route element={<ProtectedRoute />}>
//             <Route path="/dashboard" element={<Dashboard />} /> */}
//           {/* </Route> */}
          
//           {/* Protected routes that only admins can access */}
//           <Route element={<ProtectedRoute requireAdmin />}>
//             <Route path="/company-info" element={<CompanyInfo />} />
//             <Route path="/industry-selection" element={<IndustrySelection />} />
//             {/* <Route path="/domain-connection" element={<DomainConnection />} /> */}
//             {/* <Route path="/google-integration" element={<GoogleIntegration />} /> */}
//             {/* <Route path="/product-url" element={<ProductURL />} /> */}
//             {/* <Route path="/invite-team" element={<InviteTeam />} /> */}
//           </Route>
          
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// };

// export default App;
