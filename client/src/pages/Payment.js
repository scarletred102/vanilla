import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createOrder } from '../features/slices/orderSlice';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PaymentTitle = styled.h1`
  margin-bottom: 2rem;
  color: #1a1a1a;
`;

const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #1a1a1a;
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
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

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
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

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CardElementContainer = styled.div`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
`;

const PayButton = styled.button`
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

  &:hover {
    background-color: #ffed4a;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const PaymentFormComponent = ({ totalPrice, shippingAddress, cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      // Create order in backend
      await dispatch(createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod: {
          id: paymentMethod.id,
          type: 'stripe',
        },
        totalPrice,
      })).unwrap();

      navigate('/order-confirmation');
    } catch (error) {
      setError('An error occurred while processing your payment.');
      setProcessing(false);
    }
  };

  return (
    <PaymentForm onSubmit={handleSubmit}>
      <CardElementContainer>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </CardElementContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <PayButton type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
      </PayButton>
    </PaymentForm>
  );
};

const Payment = () => {
  const { user } = useSelector((state) => state.auth);
  const { cartItems, shippingAddress, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
    (state) => state.cart
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!shippingAddress) {
    navigate('/checkout');
  }

  return (
    <PaymentContainer>
      <PaymentTitle>Payment</PaymentTitle>
      <PaymentGrid>
        <PaymentSection>
          <SectionTitle>Payment Details</SectionTitle>
          <Elements stripe={stripePromise}>
            <PaymentFormComponent
              totalPrice={totalPrice}
              shippingAddress={shippingAddress}
              cartItems={cartItems}
            />
          </Elements>
        </PaymentSection>

        <OrderSummary>
          <SectionTitle>Order Summary</SectionTitle>
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
        </OrderSummary>
      </PaymentGrid>
    </PaymentContainer>
  );
};

export default Payment; 