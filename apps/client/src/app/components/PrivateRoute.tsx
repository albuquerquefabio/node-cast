import React from 'react';
import { Navigate } from 'react-router-dom';
const PrivateRouter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = localStorage.getItem('authToken');
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return token ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRouter;
