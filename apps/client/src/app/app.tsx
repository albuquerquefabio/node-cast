import Login from './components/login/Login';

import { Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import { ApiProvider } from './context/ApiContext';
import Panel from './components/panel/Panel';
import PrivateRouter from './components/PrivateRoute';

export function App() {
  return (
    <ApiProvider>
      <div>
        {/* START: routes */}
        {/* These routes and navigation have been generated for you */}
        {/* Feel free to move and update them to fit your needs */}
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
        {/* END: routes */}
      </div>
    </ApiProvider>
  );
}

export default App;
