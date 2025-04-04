import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';  
import Dashboard from './pages/dashboard/dashboard';
import Admission from './pages/admission/admission';
import Document from './pages/document/document';
import PrivateRoute from './components/routes/privateRoute';
import PublicRoute from './components/routes/publicRoute';
import SessionMonitor from './components/sessionMonitor/sessionMonitor';
import Record from './pages/record/record';
import History from './pages/history/history';

function App() {
  const isAuthenticated = !!sessionStorage.getItem("access_token");

  return (
    <Router>
      {isAuthenticated && <SessionMonitor />}
      <Routes>
        <Route path="/" element={<PublicRoute component={Login} />} />
        <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
        <Route path="/admission" element={<PrivateRoute component={Admission} />} />
        <Route path="/document" element={<PrivateRoute component={Document} />} />
        <Route path="/history" element={<PrivateRoute component={History} />} />
        <Route path="/record" element={<PrivateRoute component={Record} />} />
      </Routes>
    </Router>
  );
}

export default App;
