import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MessSecLayout from "./layouts/MessSecLayout";
import MessSecDashboard from "./pages/MessSec/MessSecDashboard";
import MessCuts from "./pages/MessSec/MessCuts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/messsec/dashboard" />} />

        <Route path="/messsec" element={<MessSecLayout />}>
          <Route path="dashboard" element={<MessSecDashboard />} />
          <Route path="mess-cuts" element={<MessCuts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
