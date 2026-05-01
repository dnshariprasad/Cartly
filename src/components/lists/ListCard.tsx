import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ShoppingBag, Calendar, Home, Plane, Briefcase, ChevronRight } from 'lucide-react';
import type { List } from '../../types';
import EditListModal from './EditListModal';

const Card = styled(Link)`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    transform: translateX(4px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: scale(0.99);
  }
`;

const IconWrapper = styled.div<{ $type: string }>`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  min-width: 0;
`;

const Title = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ChevronWrapper = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
  opacity: 0.4;
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
        <IconWrapper $type={list.type}>
          {getIcon()}
        </IconWrapper>

        <ContentSection>
          <Title>{list.title}</Title>
          <Meta>{list.itemCount} items • {list.completedCount} done</Meta>
        </ContentSection>

        <ChevronWrapper>
          <ChevronRight size={18} />
        </ChevronWrapper>
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
