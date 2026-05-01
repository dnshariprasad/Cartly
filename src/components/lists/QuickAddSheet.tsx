import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Sparkles, Plus, Check, Edit2, Search as SearchIcon, IndianRupee, Hash, Zap, Milk, ShoppingBag, Sprout, Apple, Package, Flame, Cookie, Home, User, Coffee } from 'lucide-react';
import { INDIAN_DEFAULT_ITEMS } from '../../constants/defaultItems';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 2000;
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 24px 24px 0 0;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s cubic-bezier(0, 0, 0.2, 1);

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
`;

const Handle = styled.div`
  width: 40px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  margin: 0.75rem auto;
`;

const Header = styled.div`
  padding: 0 1.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SearchContainer = styled.div`
  padding: 0 1.5rem 1rem;
  position: relative;
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
    outline: none;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  pointer-events: none;
  margin-top: -0.5rem;
`;

const CategoryScroll = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0 1.5rem 1rem;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const CategoryTab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1.25rem;
  border-radius: 100px;
  background-color: ${({ theme, $active }) => $active ? theme.colors.primary : `${theme.colors.primary}05`};
  color: ${({ theme, $active }) => $active ? 'white' : theme.colors.textSecondary};
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.border};
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme, $active }) => $active ? 'white' : theme.colors.primary};
  }
`;

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;


const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
`;

const ItemButton = styled.button<{ $added?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme, $added }) => $added ? theme.colors.success : theme.colors.border};
  background-color: ${({ theme, $added }) => $added ? `${theme.colors.success}10` : theme.colors.background};
  color: ${({ theme, $added }) => $added ? theme.colors.success : theme.colors.text};
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => `${theme.colors.primary}05`};
    transform: translateY(-2px);
  }
`;

const Footer = styled.div`
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ManualButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const QuickEditor = styled.div`
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary}10 0%, ${theme.colors.surface} 100%)`};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 24px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 10px 30px -5px ${({ theme }) => `${theme.colors.primary}20`};
  animation: slideIn 0.3s cubic-bezier(0, 0, 0.2, 1);

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const EditorTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ItemBadge = styled.div`
  padding: 0.25rem 0.75rem;
  background-color: ${({ theme }) => `${theme.colors.primary}15`};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
  display: inline-block;
`;

const EditorRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const EditorInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const EditorLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
`;

const EditorInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const EditorInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.75rem 0.6rem 2.25rem;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  font-weight: 600;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const EditorIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
`;

const EditorActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const EditorButton = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  background-color: ${({ theme, $primary }) => $primary ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $primary }) => $primary ? 'white' : theme.colors.textSecondary};
  border: 1px solid ${({ theme, $primary }) => $primary ? theme.colors.primary : theme.colors.border};

  &:hover {
    background-color: ${({ theme, $primary }) => $primary ? theme.colors.secondary : theme.colors.background};
  }
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onQuickAdd: (item: any) => Promise<void>;
  onManualEntry: () => void;
}

const QuickAddSheet: React.FC<Props> = ({ isOpen, onClose, onQuickAdd, onManualEntry }) => {
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Others');
  const [editingItem, setEditingItem] = useState<typeof INDIAN_DEFAULT_ITEMS[0] | null>(null);
  const [editQty, setEditQty] = useState(1);
  const [editPrice, setEditPrice] = useState('');
  
  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Others': return <Zap size={14} />;
      case 'Dairy': return <Milk size={14} />;
      case 'Bakery': return <ShoppingBag size={14} />;
      case 'Vegetables': return <Sprout size={14} />;
      case 'Fruits': return <Apple size={14} />;
      case 'Staples': return <Package size={14} />;
      case 'Spices': return <Flame size={14} />;
      case 'Snacks': return <Cookie size={14} />;
      case 'Household': return <Home size={14} />;
      case 'Personal Care': return <User size={14} />;
      case 'Beverages': return <Coffee size={14} />;
      default: return <Zap size={14} />;
    }
  };

  // Get unique categories and ensure 'Others' is first
  const allCategories = Array.from(new Set(INDIAN_DEFAULT_ITEMS.map(item => item.category)));
  const categories = ['Others', ...allCategories.filter(c => c !== 'Others')];

  const filteredItems = INDIAN_DEFAULT_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = searchTerm ? true : item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof INDIAN_DEFAULT_ITEMS>);

  // Sort categories for display
  const sortedDisplayCategories = searchTerm 
    ? categories.filter(c => groupedItems[c])
    : [activeCategory];

  const handleAdd = async (item: typeof INDIAN_DEFAULT_ITEMS[0], qty: number, price: number) => {
    try {
      await onQuickAdd({
        name: item.name,
        category: item.category,
        quantity: qty,
        price: price,
        status: 'Pending'
      });
      setAddedItems(prev => [...prev, item.name]);
      setEditingItem(null);
      setTimeout(() => {
        setAddedItems(prev => prev.filter(i => i !== item.name));
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (item: typeof INDIAN_DEFAULT_ITEMS[0]) => {
    setEditingItem(item);
    setEditQty(1);
    setEditPrice(item.price ? item.price.toString() : '');
  };

  return (
    <Overlay onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <Handle />
        <Header>
          <Title>
            <Sparkles size={20} color="#6366f1" />
            Quick Add Essentials
          </Title>
          <button onClick={onClose} style={{ color: '#64748b' }}><X size={20} /></button>
        </Header>

        {editingItem && (
          <div style={{ padding: '1rem 1.5rem 0' }}>
            <QuickEditor>
              <EditorTitle>
                <div style={{ flex: 1 }}>
                  <ItemBadge>Editing Item</ItemBadge>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{editingItem.name}</h2>
                </div>
                <button onClick={() => setEditingItem(null)} style={{ color: '#64748b', padding: '4px' }}><X size={24} /></button>
              </EditorTitle>
              
              <EditorRow>
                <EditorInputGroup>
                  <EditorLabel>Quantity</EditorLabel>
                  <EditorInputWrapper>
                    <EditorIcon><Hash size={16} /></EditorIcon>
                    <EditorInput 
                      type="number" 
                      min="1"
                      value={editQty}
                      onChange={(e) => setEditQty(Number(e.target.value))}
                      autoFocus
                    />
                  </EditorInputWrapper>
                </EditorInputGroup>
                
                <EditorInputGroup>
                  <EditorLabel>Price (Optional)</EditorLabel>
                  <EditorInputWrapper>
                    <EditorIcon><IndianRupee size={16} /></EditorIcon>
                    <EditorInput 
                      type="number"
                      placeholder="0.00"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  </EditorInputWrapper>
                </EditorInputGroup>
              </EditorRow>

              <EditorActions>
                <EditorButton onClick={() => setEditingItem(null)}>Cancel</EditorButton>
                <EditorButton 
                  $primary 
                  onClick={() => handleAdd(editingItem, editQty, editPrice ? Number(editPrice) : 0)}
                >
                  <Plus size={18} />
                  Add to List
                </EditorButton>
              </EditorActions>
            </QuickEditor>
          </div>
        )}

        <div style={{ marginTop: '1rem' }}>
          <SearchContainer>
            <SearchIconWrapper>
              <SearchIcon size={18} />
            </SearchIconWrapper>
            <SearchInput 
              placeholder="Search essential items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          {!searchTerm && (
            <CategoryScroll>
              {categories.map(cat => (
                <CategoryTab 
                  key={cat} 
                  $active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {getCategoryIcon(cat)}
                  {cat}
                </CategoryTab>
              ))}
            </CategoryScroll>
          )}
        </div>

        <Content>
          {sortedDisplayCategories.map(category => groupedItems[category] && (
            <CategorySection key={category}>
              <Grid>
                {groupedItems[category].map((item, idx) => (
                  <ItemButton 
                    key={idx} 
                    $added={addedItems.includes(item.name)}
                    onClick={() => startEditing(item)}
                  >
                    <span>{item.name}</span>
                    {addedItems.includes(item.name) ? <Check size={16} /> : <Plus size={16} />}
                  </ItemButton>
                ))}
              </Grid>
            </CategorySection>
          ))}
          {filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              No items found matching "{searchTerm}"
            </div>
          )}
        </Content>
        <Footer>
          <ManualButton onClick={() => {
            onClose();
            onManualEntry();
          }}>
            <Edit2 size={18} />
            <span>Add Custom Item (Manual)</span>
          </ManualButton>
        </Footer>
      </Sheet>
    </Overlay>
  );
};

export default QuickAddSheet;
