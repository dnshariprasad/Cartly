import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import CreateListModal from '../lists/CreateListModal';
import { setCreateModalOpen } from '../../store/slices/uiSlice';

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;


const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  margin-left: 0;
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
  const isCreateModalOpen = useSelector((state: RootState) => state.ui.isCreateModalOpen);

  return (
    <LayoutWrapper style={{ flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <ContentWrapper>
          <MainContent>
            <Outlet />
          </MainContent>
        </ContentWrapper>
      </div>
      <CreateListModal 
        isOpen={isCreateModalOpen} 
        onClose={() => dispatch(setCreateModalOpen(false))} 
      />
    </LayoutWrapper>
  );
};

export default MainLayout;
