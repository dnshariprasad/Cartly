import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronLeft, Plus, Filter, SortAsc, MoreVertical, Search, ShoppingCart, Trash2, Edit2 } from 'lucide-react';
import { useItems } from '../hooks/useItems';
import { useLists } from '../hooks/useLists';
import ItemRow from '../components/lists/ItemRow';
import AddItemModal from '../components/lists/AddItemModal';
import EditItemModal from '../components/lists/EditItemModal';
import EditListModal from '../components/lists/EditListModal';
import { type List, type Item } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const BackButton = styled.button`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TitleSection = styled.div`
  flex: 1;
`;

const ListTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.5px;
`;

const ListMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Badge = styled.span<{ $color: string }>`
  background-color: ${({ $color }) => `${$color}15`};
  color: ${({ $color }) => $color};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Menu = styled.div`
  position: absolute;
  right: 2rem;
  top: 5rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 100;
`;

const MenuItem = styled.button<{ $variant?: 'danger' }>`
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme, $variant }) => ($variant === 'danger' ? theme.colors.error : theme.colors.text)};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, $variant }) => ($variant === 'danger' ? `${theme.colors.error}10` : theme.colors.background)};
  }
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 4px 12px ${({ theme }) => `${theme.colors.primary}30`};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Summary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const SummaryCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SummaryLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SummaryValue = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const EmptyState = styled.div`
  padding: 5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 24px;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ListDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, loading: itemsLoading, addItem, updateItem, deleteItem } = useItems(id);
  const { deleteList } = useLists();
  const [list, setList] = useState<List | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [isEditListOpen, setIsEditListOpen] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchList = async () => {
      const docRef = doc(db, 'lists', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setList({ id: docSnap.id, ...docSnap.data() } as List);
      }
    };
    fetchList();
  }, [id, items]);

  useEffect(() => {
    if (list) {
      document.title = `Cartly | ${list.title}`;
    }
  }, [list]);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCost = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  const purchasedCost = items
    .filter(item => item.status === 'Purchased')
    .reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  if (!list && !itemsLoading) {
    return <div>List not found</div>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </BackButton>
        <TitleSection>
          <ListTitle>{list?.title || 'Loading...'}</ListTitle>
          <ListMeta>
            <Badge $color="#6366f1">{list?.type}</Badge>
            <span>{items.length} items</span>
            <span>•</span>
            <span>{items.filter(i => i.status === 'Purchased').length} purchased</span>
          </ListMeta>
        </TitleSection>
        <div style={{ position: 'relative' }}>
          <IconButton onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}>
            <MoreVertical size={20} />
          </IconButton>
          {isHeaderMenuOpen && (
            <Menu>
              <MenuItem onClick={() => { setIsEditListOpen(true); setIsHeaderMenuOpen(false); }}>
                <Edit2 size={16} />
                Edit List
              </MenuItem>
              <MenuItem $variant="danger" onClick={() => {
                if (window.confirm('Delete this list and all its items?')) {
                  deleteList(id!);
                  navigate('/');
                }
              }}>
                <Trash2 size={16} />
                Delete List
              </MenuItem>
            </Menu>
          )}
        </div>
      </Header>

      <Summary>
        <SummaryCard>
          <SummaryLabel>Total Estimated Cost</SummaryLabel>
          <SummaryValue>${totalCost.toFixed(2)}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Spent So Far</SummaryLabel>
          <SummaryValue style={{ color: '#22c55e' }}>${purchasedCost.toFixed(2)}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Remaining</SummaryLabel>
          <SummaryValue style={{ color: '#f59e0b' }}>${(totalCost - purchasedCost).toFixed(2)}</SummaryValue>
        </SummaryCard>
      </Summary>

      <Toolbar>
        <SearchBox>
          <IconWrapper>
            <Search size={18} />
          </IconWrapper>
          <SearchInput 
            placeholder="Search items..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        <ActionGroup>
          <IconButton>
            <Filter size={18} />
            <span>Filter</span>
          </IconButton>
          <PrimaryButton onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>Add Item</span>
          </PrimaryButton>
        </ActionGroup>
      </Toolbar>

      {itemsLoading ? (
        <div>Loading items...</div>
      ) : filteredItems.length > 0 ? (
        <ItemList>
          {filteredItems.map(item => (
            <ItemRow 
              key={item.id} 
              item={item} 
              onToggle={() => updateItem(item.id, { status: item.status === 'Purchased' ? 'Pending' : 'Purchased' }, item.status)}
              onDelete={() => deleteItem(item.id, item.status)}
              onEdit={() => setEditItem(item)}
            />
          ))}
        </ItemList>
      ) : (
        <EmptyState>
          <div style={{ padding: '20px', borderRadius: '50%', backgroundColor: '#6366f110', color: '#6366f1' }}>
            <ShoppingCart size={48} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.5rem' }}>No items yet</h3>
            <p>Start adding items to your "{list?.title}" list.</p>
          </div>
          <PrimaryButton onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>Add Your First Item</span>
          </PrimaryButton>
        </EmptyState>
      )}

      <AddItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addItem}
      />

      {editItem && (
        <EditItemModal 
          isOpen={!!editItem} 
          onClose={() => setEditItem(null)} 
          item={editItem}
          onUpdate={updateItem}
        />
      )}

      {list && (
        <EditListModal 
          isOpen={isEditListOpen} 
          onClose={() => setIsEditListOpen(false)} 
          list={list}
        />
      )}
    </Container>
  );
};

export default ListDetail;
