import { useReducer } from 'react';

const initialCart = [];

export const CartTypes = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  DECREASE: 'DECREASE',
  SET_QUANTITY: 'SET_QUANTITY',
  EMPTY: 'EMPTY',
};

const findItem = (cart, itemId) => cart.find((item) => item.id === itemId);

const cartReducer = (state, action) => {
  switch (action.type) {
    case CartTypes.ADD:
      if (findItem(state, action.itemId)) {
        return state.map((item) => {
          if (item.id === action.itemId) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      }

      return [
        ...state,
        { id: action.itemId, quantity: 1 },
      ];
    case CartTypes.DECREASE: {
      if (findItem(state, action.itemId)) {
        return state.map((item) => {
          if (item.id === action.itemId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        });
      }

      return [
        ...state,
        { id: action.itemId, quantity: 1 },
      ];
    }
    case CartTypes.SET_QUANTITY: {
      if (findItem(state, action.itemId)) {
        return state.map((item) => {
          if (item.id === action.itemId) {
            return { ...item, quantity: action.qty };
          }
          return item;
        });
      }

      return [
        ...state,
        { id: action.itemId, quantity: 1 },
      ];
    }
    case CartTypes.EMPTY: {
      return [];
    }
    case CartTypes.REMOVE:
      return state.filter((item) => item.id !== action.itemId);
    default:
      throw new Error(`Invalid action type ${action.type}`);
  }
};

export const useCartReducer = () => useReducer(cartReducer, initialCart);

// "eslintConfig": {
//   "extends": [
//     "react-app",
//     "react-app/jest",
//     "airbnb",
//     "airbnb/hooks"
//   ],
//   "rules": {
//     "react/react-in-jsx-scope": "off",
//     "react/jsx-filename-extension": [
//       "warn",
//       {
//         "extensions": [
//           ".js",
//           ".jsx"
//         ]
//       }
//     ],
//     "no-console": "off"
//   }
// },
