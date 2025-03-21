import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchProducts } from '../features/slices/productSlice';

const ProductsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #1a1a1a;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100px;

  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
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
    font-size: 1.1rem;
  }

  p {
    color: #666;
    margin-bottom: 0.5rem;
  }
`;

const Price = styled.span`
  font-weight: bold;
  color: #1a1a1a;
  font-size: 1.2rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: #ffd700;
    border-color: #ffd700;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  &.active {
    background: #ffd700;
    border-color: #ffd700;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  font-size: 1.2rem;
`;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    genre: searchParams.get('genre') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    condition: searchParams.get('condition') || '',
    format: searchParams.get('format') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    pageNumber: parseInt(searchParams.get('page') || '1'),
  });

  const dispatch = useDispatch();
  const { products, loading, error, pages, page } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, pageNumber: 1 }));
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set(name, value);
      } else {
        newParams.delete(name);
      }
      return newParams;
    });
  };

  const handlePageChange = (pageNumber) => {
    setFilters((prev) => ({ ...prev, pageNumber }));
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', pageNumber);
      return newParams;
    });
  };

  if (loading) {
    return <LoadingMessage>Loading products...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <ProductsContainer>
      <FiltersContainer>
        <FilterGroup>
          <Label>Search</Label>
          <Input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleFilterChange}
            placeholder="Search products..."
          />
        </FilterGroup>

        <FilterGroup>
          <Label>Genre</Label>
          <Select name="genre" value={filters.genre} onChange={handleFilterChange}>
            <option value="">All Genres</option>
            <option value="rock">Rock</option>
            <option value="pop">Pop</option>
            <option value="jazz">Jazz</option>
            <option value="classical">Classical</option>
            <option value="hip-hop">Hip Hop</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Price Range</Label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min"
            />
            <Input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max"
            />
          </div>
        </FilterGroup>

        <FilterGroup>
          <Label>Condition</Label>
          <Select name="condition" value={filters.condition} onChange={handleFilterChange}>
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="mint">Mint</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Format</Label>
          <Select name="format" value={filters.format} onChange={handleFilterChange}>
            <option value="">All Formats</option>
            <option value="vinyl">Vinyl</option>
            <option value="cd">CD</option>
            <option value="cassette">Cassette</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Sort By</Label>
          <Select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </Select>
        </FilterGroup>
      </FiltersContainer>

      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product._id}>
            <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
              <ProductImage src={product.image} alt={product.name} />
              <ProductInfo>
                <h3>{product.name}</h3>
                <p>{product.artist}</p>
                <p>{product.genre}</p>
                <Price>${product.price}</Price>
              </ProductInfo>
            </Link>
          </ProductCard>
        ))}
      </ProductGrid>

      {pages > 1 && (
        <Pagination>
          <PageButton
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </PageButton>
          {[...Array(pages)].map((_, index) => (
            <PageButton
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={page === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </PageButton>
          ))}
          <PageButton
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pages}
          >
            Next
          </PageButton>
        </Pagination>
      )}
    </ProductsContainer>
  );
};

export default Products; 