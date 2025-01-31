import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import GateAdminDashboard from "./pages/GateAdminDashboard";
import SuperAdminLogin from "./components/SuperAdminLogin";
import PrivateRoute from "./components/PrivateRoute";
import ViewTeams from "./components/ViewTeams";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/" element={<SuperAdminLogin />} />

        {/* Protected dashboard route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="superadmin">
              <SuperAdminDashboard />
            </PrivateRoute>
          }
        />
      
      <Route
          path="/gateadmin-dashboard"
          element={
            <PrivateRoute role="gateadmin">
              <GateAdminDashboard />
            </PrivateRoute>
          }
        />

      <Route path="/view-teams" element={<ViewTeams />} />
      </Routes>
    </Router>
  );
}

export default App;
