import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchProducts } from '../features/slices/productSlice';

const HeroSection = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  margin-bottom: 3rem;
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 0 2rem;

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #ffd700;
  color: #1a1a1a;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffed4a;
  }
`;

const FeaturedSection = styled.section`
  padding: 2rem 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #1a1a1a;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1rem;

  h3 {
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    margin-bottom: 1rem;
  }
`;

const Price = styled.span`
  font-weight: bold;
  color: #1a1a1a;
`;

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ pageNumber: 1, limit: 4 }));
  }, [dispatch]);

  return (
    <>
      <HeroSection>
        <HeroContent>
          <h1>Welcome to Record Store</h1>
          <p>Discover our collection of high-quality records and music</p>
          <CTAButton to="/products">Browse Products</CTAButton>
        </HeroContent>
      </HeroSection>

      <FeaturedSection>
        <SectionTitle>Featured Products</SectionTitle>
        <ProductGrid>
          {loading ? (
            <p>Loading...</p>
          ) : (
            products.map((product) => (
              <ProductCard key={product._id}>
                <ProductImage src={product.image} alt={product.name} />
                <ProductInfo>
                  <h3>{product.name}</h3>
                  <p>{product.artist}</p>
                  <Price>${product.price}</Price>
                </ProductInfo>
              </ProductCard>
            ))
          )}
        </ProductGrid>
      </FeaturedSection>
    </>
  );
};

export default Home; 