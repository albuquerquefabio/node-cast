import Login from './components/login/Login';

import { Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import { ApiProvider } from './context/ApiContext';
import Panel from './components/panel/Panel';
import PrivateRouter from './components/PrivateRoute';
import { UserProvider } from './context/UserContext';

export function App() {
  return (
    <ApiProvider>
      <UserProvider>
        <div>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  This is the generated root route.{' '}
                  <Link to="/page-2">Click here for page 2.</Link>
                </div>
              }
            />
            <Route
              path="/page-2"
              element={
                <div>
                  <Link to="/">Click here to go back to root page.</Link>
                </div>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/panel"
              element={
                <PrivateRouter>
                  <Panel />
                </PrivateRouter>
              }
            />
          </Routes>
        </div>
      </UserProvider>
    </ApiProvider>
  );
}

export default App;
