import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { removeFromCart, calculatePrices } from '../features/slices/cartSlice';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const CartTitle = styled.h1`
  margin-bottom: 2rem;
  color: #1a1a1a;
`;

const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemInfo = styled.div`
  h3 {
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    margin-bottom: 0.5rem;
  }
`;

const ItemPrice = styled.div`
  font-weight: bold;
  color: #1a1a1a;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f5f5f5;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const RemoveButton = styled.button`
  padding: 0.5rem;
  color: #dc3545;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #c82333;
  }
`;

const CartSummary = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #1a1a1a;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #666;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-weight: bold;
  font-size: 1.2rem;
  color: #1a1a1a;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #ffd700;
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;

  &:hover {
    background-color: #ffed4a;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 1rem;
    color: #1a1a1a;
  }

  p {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const ContinueShoppingButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #ffd700;
  color: #1a1a1a;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffed4a;
  }
`;

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
    (state) => state.cart
  );

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= item.countInStock) {
      dispatch(calculatePrices());
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <CartContainer>
        <EmptyCart>
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart to see them here!</p>
          <ContinueShoppingButton to="/products">
            Continue Shopping
          </ContinueShoppingButton>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartTitle>Shopping Cart</CartTitle>
      <CartGrid>
        <CartItems>
          {cartItems.map((item) => (
            <CartItem key={item._id}>
              <ItemImage src={item.image} alt={item.name} />
              <ItemInfo>
                <h3>{item.name}</h3>
                <p>{item.artist}</p>
                <ItemPrice>${item.price}</ItemPrice>
              </ItemInfo>
              <div>
                <QuantityControl>
                  <QuantityButton
                    onClick={() => handleQuantityChange(item, item.qty - 1)}
                    disabled={item.qty <= 1}
                  >
                    -
                  </QuantityButton>
                  <span>{item.qty}</span>
                  <QuantityButton
                    onClick={() => handleQuantityChange(item, item.qty + 1)}
                    disabled={item.qty >= item.countInStock}
                  >
                    +
                  </QuantityButton>
                </QuantityControl>
                <RemoveButton onClick={() => handleRemoveItem(item._id)}>
                  Remove
                </RemoveButton>
              </div>
            </CartItem>
          ))}
        </CartItems>

        <CartSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          <SummaryItem>
            <span>Items</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Shipping</span>
            <span>${shippingPrice.toFixed(2)}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Tax</span>
            <span>${taxPrice.toFixed(2)}</span>
          </SummaryItem>
          <SummaryTotal>
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </SummaryTotal>
          <CheckoutButton onClick={handleCheckout}>
            Proceed to Checkout
          </CheckoutButton>
        </CartSummary>
      </CartGrid>
    </CartContainer>
  );
};

export default Cart; 