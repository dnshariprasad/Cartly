import React from 'react';
import styled from 'styled-components';
import { Moon, Sun, LogOut, Plus, Settings as SettingsIcon, ShoppingBag, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { toggleTheme, setCreateModalOpen } from '../../store/slices/uiSlice';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

const NavContainer = styled.nav`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease;
`;

const NavInner = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 1rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  width: 200px;
  overflow: hidden;
  z-index: 200;
`;

const DropdownItem = styled(Link)`
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LogoutButton = styled.button`
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.error}05`};
  }
`;

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.ui.theme);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <NavContainer>
      <NavInner>
        <LeftSection>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white',
              flexShrink: 0
            }}>
              <ShoppingBag size={18} fill="white" />
            </div>
            <h1 style={{ 
              fontSize: '1.4rem', 
              fontWeight: 800, 
              color: 'inherit', 
              letterSpacing: '-0.5px',
              margin: 0,
              lineHeight: 1
            }}>Cartly</h1>
          </Link>
        </LeftSection>

        <RightSection>
          <IconButton onClick={() => dispatch(setCreateModalOpen(true))} style={{ backgroundColor: '#6366f115', color: '#6366f1' }}>
            <Plus size={20} />
          </IconButton>
          
          <div style={{ position: 'relative' }}>
            <IconButton onClick={() => setMoreMenuOpen(!moreMenuOpen)}>
              <MoreVertical size={20} />
            </IconButton>

            {moreMenuOpen && (
              <Dropdown onMouseLeave={() => setMoreMenuOpen(false)}>
                <div style={{ 
                  padding: '0.75rem 1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'inherit',
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }} onClick={() => dispatch(toggleTheme())}>
                  {themeMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  <span>{themeMode === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <DropdownItem to="/settings" onClick={() => setMoreMenuOpen(false)}>
                  <SettingsIcon size={16} />
                  Settings
                </DropdownItem>
              </Dropdown>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <UserProfile onClick={() => setDropdownOpen(!dropdownOpen)}>
              <Avatar style={{ borderRadius: '50%', background: '#6366f1', width: '36px', height: '36px', fontWeight: 700, border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
              </Avatar>
            </UserProfile>

            {dropdownOpen && (
              <Dropdown onMouseLeave={() => setDropdownOpen(false)}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>{user?.displayName || 'User'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{user?.email}</div>
                </div>
                <DropdownItem to="/settings" onClick={() => setDropdownOpen(false)}>
                  <SettingsIcon size={16} />
                  Settings
                </DropdownItem>
                <LogoutButton onClick={handleLogout}>
                  <LogOut size={16} />
                  Log Out
                </LogoutButton>
              </Dropdown>
            )}
          </div>
        </RightSection>
      </NavInner>
    </NavContainer>
  );
};

export default Navbar;
