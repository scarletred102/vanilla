import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { clearCart } from '../features/slices/cartSlice';

const ConfirmationContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: #d4edda;
  border-radius: 8px;
  margin-bottom: 2rem;
  color: #155724;
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #28a745;
`;

const OrderDetails = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #1a1a1a;
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
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

const ShippingInfo = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;

  h3 {
    margin-bottom: 1rem;
    color: #1a1a1a;
  }

  p {
    color: #666;
    margin-bottom: 0.5rem;
  }
`;

const PriceSummary = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled(Link)`
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

const OrderConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cartItems, shippingAddress, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
    (state) => state.cart
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    // Clear cart after successful order
    dispatch(clearCart());
  }, [user, navigate, dispatch]);

  if (!cartItems.length) {
    navigate('/products');
    return null;
  }

  return (
    <ConfirmationContainer>
      <SuccessMessage>
        <SuccessIcon>✓</SuccessIcon>
        <h2>Thank you for your order!</h2>
        <p>Your order has been successfully placed and is being processed.</p>
      </SuccessMessage>

      <OrderDetails>
        <SectionTitle>Order Details</SectionTitle>
        {cartItems.map((item) => (
          <OrderItem key={item._id}>
            <ItemImage src={item.image} alt={item.name} />
            <ItemInfo>
              <h3>{item.name}</h3>
              <p>{item.artist}</p>
              <p>Quantity: {item.qty}</p>
            </ItemInfo>
            <ItemPrice>${(item.price * item.qty).toFixed(2)}</ItemPrice>
          </OrderItem>
        ))}

        <ShippingInfo>
          <h3>Shipping Address</h3>
          <p>{shippingAddress.address}</p>
          <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
          <p>{shippingAddress.country}</p>
        </ShippingInfo>

        <PriceSummary>
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
        </PriceSummary>
      </OrderDetails>

      <ActionButtons>
        <Button to="/products">Continue Shopping</Button>
        <Button to="/profile/orders">View Order History</Button>
      </ActionButtons>
    </ConfirmationContainer>
  );
};

export default OrderConfirmation; 