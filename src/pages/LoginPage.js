import './LoginPage.css';

import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    color: '#000',
  },
};

function LoginPage() {
  const { setUserDetails } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const redirectUser = (data) => {
    if (data.access === 'associate') {
      navigate('/orders');
    } else {
      navigate('/');
    }
  };

  const login = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', {
        username,
        password,
      });

      setUserDetails(data);
      redirectUser(data);
    } catch (error) {
      console.error(error);
      setApiError(error?.response?.data?.error || 'Unknown Error');
    }
  };

  const closeApiErrorModal = () => {
    setApiError('');
    setPassword('');
  };

  return (
    <div className="login-component">
      <Modal
        isOpen={!!apiError}
        onRequestClose={closeApiErrorModal}
        style={customStyles}
        contentLabel="Login Error"
      >
        <p>There was an error submitting logging in.</p>
        <p>{ apiError }</p>
        <p>Please try again.</p>
        <button onClick={closeApiErrorModal} type="button">Ok</button>
      </Modal>
      <form onSubmit={login}>
        <div>
          <label htmlFor="username">
            Username:
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            Password:
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
        </div>
        <div><button type="submit">Login</button></div>
      </form>
    </div>
  );
}

export default LoginPage;
