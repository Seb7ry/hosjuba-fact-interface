import React from 'react';
import { BrowserRouter as Router , Switch } from 'react-router-dom';
import Login from './pages/login/login'; // Ruta al componente de Login
import Dashboard from './pages/dashboard/dashboard';
import PrivateRoute from './components/routes/privateRoute';
import PublicRoute from './components/routes/publicRoute';
//import Dashboard from './pages/Dashboard'; // Asegúrate de tener este componente

function App() {
  return (
    <Router>
      <Switch>
        <PublicRoute exact path="/" component={Login} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
      </Switch>
    </Router>
  );
}

export default App;
