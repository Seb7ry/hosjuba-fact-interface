import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Login from './pages/login/login';  
import Dashboard from './pages/dashboard/dashboard';
import Admission from './pages/admission/admission';
import Document from './pages/document/document'
import PrivateRoute from './components/routes/privateRoute';
import PublicRoute from './components/routes/publicRoute';
import SessionMonitor from './components/sessionMonitor/sessionMonitor';
import Record from './pages/record/record';

function App() {
  const isAuthenticated = !!sessionStorage.getItem("access_token"); // 👈 Revisamos sessionStorage directamente

  return (
    <Router>
      {isAuthenticated && <SessionMonitor />} {/* Se monta inmediatamente al iniciar sesión */}
      <Switch>
        <PublicRoute exact path="/" component={Login} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/admission" component={Admission} />
        <PrivateRoute exact path="/document" component={Document} />
        <PrivateRoute exact path="/history" component={Document} />
        <PrivateRoute exact path="/record" component={Record} />
      </Switch>
    </Router>
  );
}

export default App;
