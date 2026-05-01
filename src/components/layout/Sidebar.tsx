import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Home, List, Settings, PlusCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { setCreateModalOpen } from '../../store/slices/uiSlice';

const SidebarContainer = styled.aside<{ $isOpen: boolean }>`
  width: 260px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  z-index: 1000;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 240px;
    box-shadow: 10px 0 30px rgba(0,0,0,0.2);
  }
`;

const LogoContainer = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  gap: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const LogoIcon = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const LogoText = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.colors.text};
`;

const NavLinks = styled.div`
  flex: 1;
  padding: 1.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }

  &.active {
    background-color: ${({ theme }) => `${theme.colors.primary}15`};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActionButton = styled.button`
  margin: 1rem 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px ${({ theme }) => `${theme.colors.primary}40`};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px ${({ theme }) => `${theme.colors.primary}60`};
  }

  &:active {
    transform: translateY(0);
  }
`;

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

  return (
    <SidebarContainer $isOpen={sidebarOpen}>
      <LogoContainer>
        <LogoIcon>
          <Sparkles size={18} fill="white" />
        </LogoIcon>
        <LogoText>Cartly</LogoText>
      </LogoContainer>

      <NavLinks>
        <StyledNavLink to="/" end>
          <Home size={20} />
          <span>Dashboard</span>
        </StyledNavLink>
        <StyledNavLink to="/my-lists">
          <List size={20} />
          <span>My Lists</span>
        </StyledNavLink>
        <StyledNavLink to="/settings">
          <Settings size={20} />
          <span>Settings</span>
        </StyledNavLink>
      </NavLinks>

      <ActionButton onClick={() => dispatch(setCreateModalOpen(true))}>
        <PlusCircle size={20} />
        <span>Create New List</span>
      </ActionButton>
    </SidebarContainer>
  );
};

export default Sidebar;
