import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { saveShippingAddress, savePaymentMethod } from '../features/slices/cartSlice';
import { createOrder } from '../features/slices/orderSlice';

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const CheckoutTitle = styled.h1`
  margin-bottom: 2rem;
  color: #1a1a1a;
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #1a1a1a;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #1a1a1a;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
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

const PlaceOrderButton = styled.button`
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

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
    (state) => state.cart
  );

  const [formData, setFormData] = useState({
    address: shippingAddress?.address || '',
    city: shippingAddress?.city || '',
    postalCode: shippingAddress?.postalCode || '',
    country: shippingAddress?.country || '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(saveShippingAddress(formData));
      navigate('/payment');
    }
  };

  const handlePaymentMethodChange = (method) => {
    dispatch(savePaymentMethod(method));
  };

  const handlePlaceOrder = async () => {
    try {
      await dispatch(createOrder({
        orderItems: cartItems,
        shippingAddress: formData,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })).unwrap();
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <CheckoutContainer>
      <CheckoutTitle>Checkout</CheckoutTitle>
      <CheckoutGrid>
        <FormSection>
          <SectionTitle>Shipping Address</SectionTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
              />
              {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="city">City</Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
              />
              {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Enter your postal code"
              />
              {errors.postalCode && <ErrorMessage>{errors.postalCode}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="country">Country</Label>
              <Input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Enter your country"
              />
              {errors.country && <ErrorMessage>{errors.country}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>Payment Method</Label>
              <RadioGroup>
                <RadioLabel>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  />
                  Credit Card (Stripe)
                </RadioLabel>
                <RadioLabel>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  />
                  PayPal
                </RadioLabel>
              </RadioGroup>
            </FormGroup>

            <PlaceOrderButton type="submit" disabled={!paymentMethod}>
              Continue to Payment
            </PlaceOrderButton>
          </Form>
        </FormSection>

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
      </CheckoutGrid>
    </CheckoutContainer>
  );
};

export default Checkout; 