import React from 'react';
import styled from 'styled-components';
import { Menu, Moon, Sun, User, LogOut, ChevronDown, Plus, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { toggleSidebar, toggleTheme, setCreateModalOpen } from '../../store/slices/uiSlice';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

const NavContainer = styled.nav`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease;
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

const UserName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
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
      <LeftSection>
        <IconButton onClick={() => dispatch(toggleSidebar())}>
          <Menu size={20} />
        </IconButton>
      </LeftSection>

      <RightSection>
        <IconButton onClick={() => dispatch(setCreateModalOpen(true))} style={{ backgroundColor: '#6366f115', color: '#6366f1' }}>
          <Plus size={20} />
        </IconButton>
        
        <IconButton onClick={() => dispatch(toggleTheme())}>
          {themeMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </IconButton>
        
        <div style={{ position: 'relative' }}>
          <UserProfile onClick={() => setDropdownOpen(!dropdownOpen)}>
            <Avatar>
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" />
              ) : (
                <User size={18} />
              )}
            </Avatar>
            <UserName>{user?.displayName || user?.email?.split('@')[0]}</UserName>
            <ChevronDown size={14} style={{ color: '#94a3b8' }} />
          </UserProfile>

          {dropdownOpen && (
            <Dropdown onMouseLeave={() => setDropdownOpen(false)}>
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
    </NavContainer>
  );
};

export default Navbar;
