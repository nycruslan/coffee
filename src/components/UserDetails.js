import './UserDetails.css';

import axios from 'axios';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

function UserDetails() {
  const navigate = useNavigate();
  const { userDetails, setUserDetails } = useContext(UserContext);

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {});
      setUserDetails({});
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="user-details-component">
      { userDetails.username
        ? (
          <div>
            {`Welcome, ${userDetails.username}`}
            {userDetails.access === 'associate' && (
              <Link to="/orders">My orders</Link>)}
            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>
        ) : <Link to="/login">Login</Link> }
    </div>
  );
}

export default UserDetails;
