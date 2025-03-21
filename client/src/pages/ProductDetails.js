import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchProductDetails, createProductReview } from '../features/slices/productSlice';
import { addToCart } from '../features/slices/cartSlice';

const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const InfoSection = styled.div`
  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #1a1a1a;
  }

  h2 {
    font-size: 1.5rem;
    color: #666;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #1a1a1a;
  margin: 1rem 0;
`;

const StockStatus = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: ${({ inStock }) => (inStock ? '#28a745' : '#dc3545')};
  color: white;
  margin-bottom: 1rem;
`;

const AddToCartButton = styled.button`
  padding: 1rem 2rem;
  background-color: #ffd700;
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-bottom: 1rem;

  &:hover {
    background-color: #ffed4a;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ReviewsSection = styled.div`
  margin-top: 3rem;
`;

const ReviewForm = styled.form`
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Review = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    margin-bottom: 0.5rem;
  }
`;

const Rating = styled.div`
  color: #ffd700;
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      setReviewError('Please fill in all fields');
      return;
    }

    try {
      await dispatch(createProductReview({ id, rating, comment })).unwrap();
      setRating(0);
      setComment('');
      setReviewError('');
    } catch (err) {
      setReviewError(err.message);
    }
  };

  if (loading) {
    return <LoadingMessage>Loading product details...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <ProductContainer>
      <ProductGrid>
        <ImageSection>
          <img src={product.image} alt={product.name} />
        </ImageSection>

        <InfoSection>
          <h1>{product.name}</h1>
          <h2>{product.artist}</h2>
          <p>{product.description}</p>
          <p>
            <strong>Genre:</strong> {product.genre}
          </p>
          <p>
            <strong>Format:</strong> {product.format}
          </p>
          <p>
            <strong>Condition:</strong> {product.condition}
          </p>
          <p>
            <strong>Release Year:</strong> {product.releaseYear}
          </p>
          <Price>${product.price}</Price>
          <StockStatus inStock={product.countInStock > 0}>
            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
          </StockStatus>
          <AddToCartButton
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
          >
            Add to Cart
          </AddToCartButton>
        </InfoSection>
      </ProductGrid>

      <ReviewsSection>
        <h2>Reviews</h2>
        {userInfo && (
          <ReviewForm onSubmit={handleReviewSubmit}>
            <h3>Write a Review</h3>
            {reviewError && <ErrorMessage>{reviewError}</ErrorMessage>}
            <FormGroup>
              <Label>Rating</Label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem' }}
              >
                <option value="">Select...</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </FormGroup>
            <FormGroup>
              <Label>Comment</Label>
              <TextArea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here..."
              />
            </FormGroup>
            <AddToCartButton type="submit">Submit Review</AddToCartButton>
          </ReviewForm>
        )}

        <ReviewList>
          {product.reviews?.map((review) => (
            <Review key={review._id}>
              <h3>{review.user.name}</h3>
              <Rating>{'★'.repeat(review.rating)}</Rating>
              <p>{review.comment}</p>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </Review>
          ))}
        </ReviewList>
      </ReviewsSection>
    </ProductContainer>
  );
};

export default ProductDetails; 