import { Loader } from 'components';
import { useAuth } from 'hooks';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }
  return currentUser ? children : <Navigate to={'/signin'} replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export const NonProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  if (isLoading) {
    return <Loader />;
  }
  return currentUser ? <Navigate to={'/'} /> : children;
};

NonProtectedRoute.propTypes = {
  children: PropTypes.node,
};
