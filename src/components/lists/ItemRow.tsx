import React from 'react';
import styled from 'styled-components';
import { Check, Trash2, MoreVertical, Clock, Tag, Edit2 } from 'lucide-react';
import { type Item } from '../../types';

const Row = styled.div<{ $isCompleted: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  gap: 1rem;
  transition: all 0.2s ease;
  opacity: ${({ $isCompleted }) => ($isCompleted ? 0.7 : 1)};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateX(4px);
  }
`;

const Checkbox = styled.button<{ $checked: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid ${({ theme, $checked }) => ($checked ? theme.colors.success : theme.colors.border)};
  background-color: ${({ theme, $checked }) => ($checked ? theme.colors.success : 'transparent')};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.success};
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

const ItemName = styled.span<{ $isCompleted: boolean }>`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: ${({ $isCompleted }) => ($isCompleted ? 'line-through' : 'none')};
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const Price = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
`;

const ActionButton = styled.button<{ $variant?: 'danger' | 'default' }>`
  padding: 0.5rem;
  border-radius: 8px;
  color: ${({ theme, $variant }) => ($variant === 'danger' ? theme.colors.error : theme.colors.textSecondary)};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, $variant }) => ($variant === 'danger' ? `${theme.colors.error}10` : theme.colors.background)};
    color: ${({ theme, $variant }) => ($variant === 'danger' ? theme.colors.error : theme.colors.primary)};
  }
`;

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
`;

const Menu = styled.div`
  position: absolute;
  right: 1.25rem;
  top: 3.5rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 100;
`;

const MenuItem = styled.button<{ $variant?: 'danger' }>`
  padding: 0.625rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme, $variant }) => ($variant === 'danger' ? theme.colors.error : theme.colors.text)};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, $variant }) => ($variant === 'danger' ? `${theme.colors.error}10` : theme.colors.background)};
  }
`;

interface Props {
  item: Item;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const ItemRow: React.FC<Props> = ({ item, onToggle, onDelete, onEdit }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {menuOpen && <MenuOverlay onClick={() => setMenuOpen(false)} />}
      <Row $isCompleted={item.status === 'Purchased'}>
        <Checkbox $checked={item.status === 'Purchased'} onClick={onToggle}>
          {item.status === 'Purchased' && <Check size={14} strokeWidth={3} />}
        </Checkbox>

        <Content onClick={onToggle} style={{ cursor: 'pointer' }}>
          <ItemName $isCompleted={item.status === 'Purchased'}>{item.name}</ItemName>
          <Meta>
            <MetaItem>
              <Tag size={12} />
              {item.category}
            </MetaItem>
            <MetaItem>
              <Clock size={12} />
              Qty: {item.quantity}
            </MetaItem>
            {item.notes && <span>• {item.notes}</span>}
          </Meta>
        </Content>

        {item.price && <Price>₹{(item.price * item.quantity).toFixed(2)}</Price>}

        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <ActionButton onClick={() => setMenuOpen(!menuOpen)}>
            <MoreVertical size={18} />
          </ActionButton>
        </div>
      </Row>

      {menuOpen && (
        <Menu>
          <MenuItem onClick={() => { onEdit(); setMenuOpen(false); }}>
            <Edit2 size={14} />
            Edit Item
          </MenuItem>
          <MenuItem $variant="danger" onClick={() => { onDelete(); setMenuOpen(false); }}>
            <Trash2 size={14} />
            Delete Item
          </MenuItem>
        </Menu>
      )}
    </div>
  );
};

export default React.memo(ItemRow);
