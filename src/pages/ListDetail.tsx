import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Plus, Search, Trash2, Edit2, ShoppingCart } from 'lucide-react';
import { useItems } from '../hooks/useItems';
import { useLists } from '../hooks/useLists';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import ItemRow from '../components/lists/ItemRow';
import AddItemModal from '../components/lists/AddItemModal';
import EditItemModal from '../components/lists/EditItemModal';
import EditListModal from '../components/lists/EditListModal';
import { type List, type Item } from '../types';
import QuickAddSheet from '../components/lists/QuickAddSheet';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0;
`;


const PageTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.5rem 0;
  position: sticky;
  top: 64px;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 50;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 0.75rem 0;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
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
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.surface};
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}10`};
  }
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

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1.5rem;
  border-radius: 100px;
  font-size: 0.8125rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ theme, $active }) => ($active ? 'white' : theme.colors.textSecondary)};
  box-shadow: ${({ $active }) => ($active ? '0 10px 15px -3px rgba(99, 102, 241, 0.3)' : 'none')};
  border: none;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: ${({ theme, $active }) => ($active ? 'white' : theme.colors.primary)};
    background-color: ${({ theme, $active }) => (!$active ? `${theme.colors.primary}10` : theme.colors.primary)};
  }
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

const FAB = styled.button`
  position: fixed;
  bottom: 2rem;
  left: 1.5rem;
  width: 60px;
  height: 60px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px ${({ theme }) => `${theme.colors.primary}40`};
  border: none;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    transform: scale(1.1) rotate(90deg);
    background-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 15px 30px -5px ${({ theme }) => `${theme.colors.primary}60`};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ListDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, loading: itemsLoading, addItem, updateItem, deleteItem } = useItems(id);
  const { deleteList } = useLists();
  const themeMode = useSelector((state: RootState) => state.ui.theme);
  const [list, setList] = useState<List | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [isEditListOpen, setIsEditListOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'purchased'>('all');

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

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'pending' ? item.status === 'Pending' :
      item.status === 'Purchased';
    return matchesSearch && matchesStatus;
  });

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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <PageTitle style={{ fontSize: '1.75rem' }}>{list?.title || 'Loading...'}</PageTitle>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <IconButton onClick={() => {
                if (window.confirm('Delete this list and all its items?')) {
                  deleteList(id!);
                  navigate('/');
                }
              }} title="Delete List" style={{ backgroundColor: '#ef444410', color: '#ef4444' }}>
                <Trash2 size={20} />
              </IconButton>
              <IconButton onClick={() => setIsEditListOpen(true)} title="Edit List" style={{ backgroundColor: '#6366f110', color: '#6366f1' }}>
                <Edit2 size={20} />
              </IconButton>
              <IconButton onClick={() => setIsModalOpen(true)} title="Add Item" style={{ backgroundColor: '#6366f1', color: 'white', border: 'none' }}>
                <Plus size={20} />
              </IconButton>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>Total({items.length}): ₹{Math.round(totalCost)}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981' }}>Purchased({items.filter(i => i.status === 'Purchased').length}): ₹{Math.round(purchasedCost)}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b' }}>To Buy({items.filter(i => i.status === 'Pending').length}): ₹{Math.round(totalCost - purchasedCost)}</span>
          </div>
        </div>
      </Header>

      <Toolbar>
        <SearchBox>
          <IconWrapper style={{ opacity: 0.4 }}>
            <Search size={14} />
          </IconWrapper>
          <SearchInput 
            placeholder="Search items..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontSize: '0.875rem', padding: '0.6rem 1rem 0.6rem 2.5rem' }}
          />
        </SearchBox>

        <div style={{ 
          display: 'flex', 
          gap: '0.25rem', 
          backgroundColor: themeMode === 'light' ? '#f1f5f9' : '#1e293b', 
          padding: '0.3rem', 
          borderRadius: '100px',
          border: '1px solid ' + (themeMode === 'light' ? '#e2e8f0' : '#334155'),
          flexShrink: 0,
          minWidth: '300px'
        }}>
          <FilterButton $active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} style={{ flex: 1, padding: '0.5rem 1rem' }}>All</FilterButton>
          <FilterButton $active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')} style={{ flex: 1, padding: '0.5rem 1rem' }}>To Buy</FilterButton>
          <FilterButton $active={statusFilter === 'purchased'} onClick={() => setStatusFilter('purchased')} style={{ flex: 1, padding: '0.5rem 1rem' }}>Purchased</FilterButton>
        </div>
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
        onSwitchToEssentials={() => setIsQuickAddOpen(true)}
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
      <QuickAddSheet 
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onQuickAdd={addItem}
        onManualEntry={() => setIsModalOpen(true)}
      />

      <FAB onClick={() => setIsModalOpen(true)} title="Add Item">
        <Plus size={28} strokeWidth={2.5} />
      </FAB>
    </Container>
  );
};

export default ListDetail;
