import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchOrderDetails } from '../features/slices/orderSlice';

const OrderDetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  margin-bottom: 2rem;
  color: #1a1a1a;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const OrderInfo = styled.div`
  h2 {
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  p {
    color: #666;
  }
`;

const OrderStatus = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'Delivered':
        return '#d4edda';
      case 'Processing':
        return '#fff3cd';
      case 'Shipped':
        return '#cce5ff';
      default:
        return '#f8d7da';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Delivered':
        return '#155724';
      case 'Processing':
        return '#856404';
      case 'Shipped':
        return '#004085';
      default:
        return '#721c24';
    }
  }};
`;

const Section = styled.div`
  margin-bottom: 2rem;

  h3 {
    margin-bottom: 1rem;
    color: #1a1a1a;
  }
`;

const OrderItems = styled.div`
  display: grid;
  gap: 1rem;
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  align-items: center;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemInfo = styled.div`
  h4 {
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
  text-align: right;
`;

const ShippingInfo = styled.div`
  p {
    color: #666;
    margin-bottom: 0.5rem;
  }
`;

const PriceSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
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

const PaymentInfo = styled.div`
  p {
    color: #666;
    margin-bottom: 0.5rem;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #dc3545;
`;

const OrderDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { selectedOrder, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(fetchOrderDetails(id));
    }
  }, [user, navigate, dispatch, id]);

  if (loading) {
    return (
      <OrderDetailsContainer>
        <LoadingState>Loading order details...</LoadingState>
      </OrderDetailsContainer>
    );
  }

  if (error) {
    return (
      <OrderDetailsContainer>
        <ErrorState>Error: {error}</ErrorState>
      </OrderDetailsContainer>
    );
  }

  if (!selectedOrder) {
    return (
      <OrderDetailsContainer>
        <ErrorState>Order not found</ErrorState>
      </OrderDetailsContainer>
    );
  }

  return (
    <OrderDetailsContainer>
      <PageTitle>Order Details</PageTitle>
      <OrderCard>
        <OrderHeader>
          <OrderInfo>
            <h2>Order #{selectedOrder._id.slice(-6).toUpperCase()}</h2>
            <p>Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
          </OrderInfo>
          <OrderStatus status={selectedOrder.status}>
            {selectedOrder.status}
          </OrderStatus>
        </OrderHeader>

        <Section>
          <h3>Order Items</h3>
          <OrderItems>
            {selectedOrder.orderItems.map((item) => (
              <OrderItem key={item._id}>
                <ItemImage src={item.image} alt={item.name} />
                <ItemInfo>
                  <h4>{item.name}</h4>
                  <p>{item.artist}</p>
                  <p>Quantity: {item.qty}</p>
                </ItemInfo>
                <ItemPrice>
                  ${(item.price * item.qty).toFixed(2)}
                </ItemPrice>
              </OrderItem>
            ))}
          </OrderItems>
        </Section>

        <Section>
          <h3>Shipping Information</h3>
          <ShippingInfo>
            <p>{selectedOrder.shippingAddress.address}</p>
            <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
            <p>{selectedOrder.shippingAddress.country}</p>
          </ShippingInfo>
        </Section>

        <Section>
          <h3>Payment Information</h3>
          <PaymentInfo>
            <p>Payment Method: {selectedOrder.paymentMethod.type}</p>
            <p>Payment Status: {selectedOrder.isPaid ? 'Paid' : 'Not Paid'}</p>
            {selectedOrder.paidAt && (
              <p>Paid on: {new Date(selectedOrder.paidAt).toLocaleDateString()}</p>
            )}
          </PaymentInfo>
        </Section>

        <PriceSummary>
          <SummaryItem>
            <span>Items</span>
            <span>${selectedOrder.itemsPrice.toFixed(2)}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Shipping</span>
            <span>${selectedOrder.shippingPrice.toFixed(2)}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Tax</span>
            <span>${selectedOrder.taxPrice.toFixed(2)}</span>
          </SummaryItem>
          <SummaryTotal>
            <span>Total</span>
            <span>${selectedOrder.totalPrice.toFixed(2)}</span>
          </SummaryTotal>
        </PriceSummary>
      </OrderCard>
    </OrderDetailsContainer>
  );
};

export default OrderDetails; 