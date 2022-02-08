import { createContext } from 'react';

const UserContext = createContext({
  userDetails: { access: '', username: '' },
  setUserDetails: () => {},
});

export default UserContext;
