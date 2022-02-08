import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Modal from 'react-modal';

import PropTypes from 'prop-types';
import UserContext from '../context/UserContext';

function AuthGuard({ children }) {
  const { userDetails } = useContext(UserContext);

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  if (!userDetails.username) {
    return <Navigate to="/login" />;
  }

  if (userDetails.access !== 'associate') {
    return <Navigate to="/login" />;
  }

  return children;
}

AuthGuard.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AuthGuard;
