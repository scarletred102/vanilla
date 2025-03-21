import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../../features/slices/authSlice';
import { clearCart } from '../../features/slices/cartSlice';

const HeaderContainer = styled.header`
  background-color: #1a1a1a;
  padding: 1rem 2rem;
  color: white;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  &:hover {
    color: #ffd700;
  }
`;

const UserMenu = styled.div`
  position: relative;
  cursor: pointer;
`;

const UserMenuContent = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  color: #1a1a1a;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const MenuItem = styled(Link)`
  display: block;
  padding: 0.5rem 1rem;
  color: #1a1a1a;
  text-decoration: none;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const CartBadge = styled.span`
  background-color: #ffd700;
  color: #1a1a1a;
  padding: 0.25rem 0.5rem;
  border-radius: 50%;
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/login');
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">Record Store</Logo>
        <NavLinks>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/cart">
            Cart
            {cartItems.length > 0 && <CartBadge>{cartItems.length}</CartBadge>}
          </NavLink>
          {userInfo ? (
            <UserMenu onMouseEnter={() => setIsMenuOpen(true)} onMouseLeave={() => setIsMenuOpen(false)}>
              {userInfo.name}
              <UserMenuContent isOpen={isMenuOpen}>
                <MenuItem to="/profile">Profile</MenuItem>
                <MenuItem to="/orders">Orders</MenuItem>
                {userInfo.isAdmin && <MenuItem to="/admin">Admin Panel</MenuItem>}
                <MenuItem as="button" onClick={handleLogout}>
                  Logout
                </MenuItem>
              </UserMenuContent>
            </UserMenu>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 