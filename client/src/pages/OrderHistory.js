import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchOrders } from '../features/slices/orderSlice';

const OrderHistoryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  margin-bottom: 2rem;
  color: #1a1a1a;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 150px;
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const OrderInfo = styled.div`
  h3 {
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

const OrderItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemInfo = styled.div`
  h4 {
    margin-bottom: 0.25rem;
  }

  p {
    color: #666;
    font-size: 0.9rem;
  }
`;

const OrderSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const OrderTotal = styled.div`
  font-weight: bold;
  color: #1a1a1a;
`;

const ViewDetailsButton = styled(Link)`
  padding: 0.5rem 1rem;
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

const EmptyState = styled.div`
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

const OrderHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.orders);

  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(fetchOrders());
    }
  }, [user, navigate, dispatch]);

  const filteredOrders = orders
    .filter(order => statusFilter === 'all' || order.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest':
          return b.totalPrice - a.totalPrice;
        case 'lowest':
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!orders.length) {
    return (
      <OrderHistoryContainer>
        <EmptyState>
          <h2>No Orders Yet</h2>
          <p>Start shopping to see your order history here!</p>
          <ContinueShoppingButton to="/products">
            Continue Shopping
          </ContinueShoppingButton>
        </EmptyState>
      </OrderHistoryContainer>
    );
  }

  return (
    <OrderHistoryContainer>
      <PageTitle>Order History</PageTitle>
      <FiltersContainer>
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </FilterSelect>

        <FilterSelect
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Price</option>
          <option value="lowest">Lowest Price</option>
        </FilterSelect>
      </FiltersContainer>

      <OrderList>
        {filteredOrders.map((order) => (
          <OrderCard key={order._id}>
            <OrderHeader>
              <OrderInfo>
                <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </OrderInfo>
              <OrderStatus status={order.status}>
                {order.status}
              </OrderStatus>
            </OrderHeader>

            <OrderItems>
              {order.orderItems.map((item) => (
                <OrderItem key={item._id}>
                  <ItemImage src={item.image} alt={item.name} />
                  <ItemInfo>
                    <h4>{item.name}</h4>
                    <p>{item.artist}</p>
                    <p>Qty: {item.qty}</p>
                  </ItemInfo>
                </OrderItem>
              ))}
            </OrderItems>

            <OrderSummary>
              <OrderTotal>
                Total: ${order.totalPrice.toFixed(2)}
              </OrderTotal>
              <ViewDetailsButton to={`/orders/${order._id}`}>
                View Details
              </ViewDetailsButton>
            </OrderSummary>
          </OrderCard>
        ))}
      </OrderList>
    </OrderHistoryContainer>
  );
};

export default OrderHistory; 