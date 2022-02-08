import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import axios from 'axios';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';
import DetailsPage from './pages/DetailsPage';
import { CartTypes, useCartReducer } from './reducers/cartReducer';
import UserContext from './context/UserContext';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrdersPage';
import AuthGuard from './components/AuthGuard';

function App() {
  const [cart, dispatch] = useCartReducer();
  const [items, setItems] = useState([]);
  const [errorHandler, setErrorHandler] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const addToCart = useCallback((itemId) => dispatch({ type: CartTypes.ADD, itemId }), [dispatch]);

  const userContextValue = useMemo(
    () => ({ userDetails, setUserDetails }),
    [userDetails, setUserDetails],
  );

  // eslint-disable-next-line max-len
  const setQuantity = useCallback((itemId, qty) => dispatch({ type: CartTypes.SET_QUANTITY, itemId, qty }), [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/items');
        setItems(data);
      } catch (error) {
        setErrorHandler(true);
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/auth/current-user');

        setUserDetails(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const conditionalRender = () => {
    if (items.length === 0) {
      return (
        <div style={{ margin: '2rem' }}>
          <ClipLoader size={100} color="white" />
        </div>
      );
    }

    if (errorHandler) {
      return <h2>Error</h2>;
    }

    return (
      <Routes>
        <Route
          path="/orders"
          element={(
            <AuthGuard>
              <OrdersPage items={items} />
            </AuthGuard>
          )}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage setQuantity={setQuantity} cart={cart} dispatch={dispatch} items={items} />} />
        <Route path="/details/:id" element={<DetailsPage addToCart={addToCart} items={items} />} />
        <Route path="/" element={<HomePage items={items} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
  };

  return (
    <Router>
      <UserContext.Provider value={userContextValue}>
        <Header cart={cart} />
        {conditionalRender()}
      </UserContext.Provider>
    </Router>
  );
}

export default App;
