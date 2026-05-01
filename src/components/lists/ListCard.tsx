import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ShoppingBag, Calendar, Home, Plane, Briefcase, ChevronRight, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import type { List } from '../../types';
import { useLists } from '../../hooks/useLists';
import EditListModal from './EditListModal';

const Card = styled(Link)`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  position: relative;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const IconWrapper = styled.div<{ $type: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
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

const MoreButton = styled.button`
  padding: 0.5rem;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Menu = styled.div`
  position: absolute;
  top: 3.5rem;
  right: 1.5rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 20;
`;

const MenuItem = styled.button<{ $variant?: 'danger' }>`
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme, $variant }) => ($variant === 'danger' ? theme.colors.error : theme.colors.text)};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, $variant }) => ($variant === 'danger' ? `${theme.colors.error}10` : theme.colors.background)};
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h4`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const TypeTag = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressBar = styled.div`
  height: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => `${$percent}%`};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 3px;
  transition: width 0.5s ease;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ItemCount = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ViewLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ListCard: React.FC<{ list: List }> = ({ list }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const { deleteList } = useLists();

  const getIcon = () => {
    switch (list.type) {
      case 'Home': return <Home size={20} />;
      case 'Event': return <Calendar size={20} />;
      case 'Travel': return <Plane size={20} />;
      case 'Work': return <Briefcase size={20} />;
      default: return <ShoppingBag size={20} />;
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditModalOpen(true);
    setMenuOpen(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this list?')) {
      try {
        await deleteList(list.id);
      } catch (err) {
        console.error(err);
      }
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
          <TypeTag>{list.type}</TypeTag>
        </div>
        <MoreButton onClick={handleMoreClick}>
          <MoreVertical size={20} />
        </MoreButton>
        {menuOpen && (
          <Menu onClick={e => e.stopPropagation()}>
            <MenuItem onClick={handleEdit}>
              <Edit2 size={16} />
              Edit List
            </MenuItem>
            <MenuItem $variant="danger" onClick={handleDelete}>
              <Trash2 size={16} />
              Delete List
            </MenuItem>
          </Menu>
        )}
      </CardHeader>

      <TitleSection>
        <Title>{list.title}</Title>
        <ItemCount>{list.itemCount} items • {list.completedCount} purchased</ItemCount>
      </TitleSection>



      <Footer>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          {new Date(list.createdAt).toLocaleDateString()}
        </span>
        <ViewLink>
          <span>View Items</span>
          <ChevronRight size={16} />
        </ViewLink>
      </Footer>
      </Card>
      
      <EditListModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        list={list} 
      />
    </>
  );
};

export default React.memo(ListCard);
