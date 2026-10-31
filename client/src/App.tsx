import React from 'react';
import { CartProvider } from './context/CartContext';
import { OrderPage } from './pages/OrderPage';

/** The public experience deliberately has one address and one customer journey. */
export const App: React.FC = () => (
  <CartProvider>
    <OrderPage />
  </CartProvider>
);

export default App;
