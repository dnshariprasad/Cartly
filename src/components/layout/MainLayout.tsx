import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import CreateListModal from '../lists/CreateListModal';
import { setCreateModalOpen, toggleSidebar } from '../../store/slices/uiSlice';

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 900;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const ContentWrapper = styled.div<{ $sidebarOpen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? '260px' : '0')};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 0;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;


const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  const isCreateModalOpen = useSelector((state: RootState) => state.ui.isCreateModalOpen);

  return (
    <LayoutWrapper>
      <Overlay $isOpen={sidebarOpen} onClick={() => dispatch(toggleSidebar())} />
      <Sidebar />
      <ContentWrapper $sidebarOpen={sidebarOpen}>
        <Navbar />
        <MainContent>
          <Outlet />
        </MainContent>
      </ContentWrapper>
      <CreateListModal 
        isOpen={isCreateModalOpen} 
        onClose={() => dispatch(setCreateModalOpen(false))} 
      />
    </LayoutWrapper>
  );
};

export default MainLayout;
