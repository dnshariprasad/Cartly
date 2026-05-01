import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ShoppingBag, Calendar, Home, Plane, Briefcase } from 'lucide-react';
import type { List } from '../../types';
import EditListModal from './EditListModal';

const Card = styled(Link)`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  position: relative;
  text-decoration: none;

  &:hover {
    transform: translateY(-8px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const IconWrapper = styled.div<{ $type: string }>`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $type }) => {
    switch ($type) {
      case 'Home': return `${theme.colors.primary}15`;
      case 'Event': return `${theme.colors.success}15`;
      case 'Travel': return `${theme.colors.info}15`;
      case 'Work': return `${theme.colors.warning}15`;
      default: return `${theme.colors.secondary}15`;
    }
  }};
  color: ${({ theme, $type }) => {
    switch ($type) {
      case 'Home': return theme.colors.primary;
      case 'Event': return theme.colors.success;
      case 'Travel': return theme.colors.info;
      case 'Work': return theme.colors.warning;
      default: return theme.colors.secondary;
    }
  }};
`;


const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h4`
  font-size: 1.35rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.5px;
`;


const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ItemCount = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ListCard: React.FC<{ list: List }> = ({ list }) => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const getIcon = () => {
    switch (list.type) {
      case 'Home': return <Home size={20} />;
      case 'Event': return <Calendar size={20} />;
      case 'Travel': return <Plane size={20} />;
      case 'Work': return <Briefcase size={20} />;
      default: return <ShoppingBag size={20} />;
    }
  };


  return (
    <>
      <Card to={`/list/${list.id}`}>
        <CardHeader>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <IconWrapper $type={list.type}>
            {getIcon()}
          </IconWrapper>
        </div>
      </CardHeader>

      <TitleSection>
        <Title>{list.title}</Title>
        <ItemCount>{list.itemCount} items • {list.completedCount} purchased</ItemCount>
      </TitleSection>



      <Footer>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          {new Date(list.createdAt).toLocaleDateString()}
        </span>
      </Footer>
      </Card>
      
      <EditListModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        list={list} 
      />
    </>
  );
};

export default React.memo(ListCard);
