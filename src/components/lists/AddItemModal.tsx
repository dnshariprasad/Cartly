import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Package, Tag, Hash, IndianRupee, Check, Sparkles, Plus } from 'lucide-react';
import { INDIAN_DEFAULT_ITEMS } from '../../constants/defaultItems';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 500px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 24px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  
  @media (max-width: 768px) {
    max-width: none;
    border-radius: 24px 24px 0 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    animation: slideUp 0.3s cubic-bezier(0, 0, 0.2, 1);
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
`;

const DragHandle = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    width: 40px;
    height: 4px;
    background-color: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
    margin: 0.75rem auto 0;
  }
`;

const ModalHeader = styled.div`
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
`;

const Form = styled.form`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}15`};
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const SuggestionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  margin-top: 4px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 240px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const SuggestionItem = styled.button`
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}10`};
  }
`;

const SuggestionName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
`;

const SuggestionCategory = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;


const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.textSecondary}10`};
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const CreateButton = styled.button`
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => Promise<void>;
  onSwitchToEssentials: () => void;
}

const AddItemModal: React.FC<Props> = ({ isOpen, onClose, onAdd, onSwitchToEssentials }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Grocery');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  if (!isOpen) return null;

  const suggestions = name.trim().length > 0 
    ? INDIAN_DEFAULT_ITEMS.filter(item => 
        item.name.toLowerCase().includes(name.toLowerCase()) && 
        item.name.toLowerCase() !== name.toLowerCase()
      ).slice(0, 10)
    : [];

  const handleSuggestionClick = (item: typeof INDIAN_DEFAULT_ITEMS[0]) => {
    setName(item.name);
    setCategory(item.category);
    if (item.price) setPrice(item.price.toString());
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onAdd({
        name,
        category,
        quantity: Number(quantity),
        price: price ? Number(price) : 0,
        status: 'Pending' as const
      });
      setName('');
      setCategory('Grocery');
      setQuantity(1);
      setPrice('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <DragHandle />
        <ModalHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#6366f115', color: '#6366f1' }}>
              <Plus size={18} />
            </div>
            <ModalTitle>Add Custom Item</ModalTitle>
          </div>
          <button onClick={onClose} style={{ color: '#64748b' }}><X size={20} /></button>
        </ModalHeader>

        <div style={{ padding: '1rem 1.5rem 0' }}>
          <button 
            onClick={() => {
              onClose();
              onSwitchToEssentials();
            }}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              borderRadius: '16px', 
              background: 'linear-gradient(135deg, #f59e0b15 0%, #f59e0b05 100%)', 
              color: '#f59e0b', 
              border: '1px solid #f59e0b30',
              fontWeight: 800,
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.1)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b25 0%, #f59e0b10 100%)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b15 0%, #f59e0b05 100%)';
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '10px',
              backgroundColor: '#f59e0b20'
            }}>
              <Sparkles size={18} fill="#f59e0b" fillOpacity={0.2} />
            </div>
            <span>Pick from Essentials Catalog</span>
          </button>
        </div>
        

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Item Name</Label>
            <InputWrapper>
              <IconWrapper><Package size={18} /></IconWrapper>
              <Input 
                placeholder="e.g. Whole Milk" 
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (name.trim().length > 0) setShowSuggestions(true);
                }}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                required
                autoFocus
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <SuggestionsDropdown>
                  {suggestions.map((item, idx) => (
                    <SuggestionItem 
                      key={idx} 
                      type="button"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <SuggestionName>{item.name}</SuggestionName>
                      <SuggestionCategory>{item.category}</SuggestionCategory>
                    </SuggestionItem>
                  ))}
                </SuggestionsDropdown>
              )}
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>Category</Label>
            <InputWrapper>
              <IconWrapper><Tag size={18} /></IconWrapper>
              <Input 
                placeholder="Grocery, Electronics, etc." 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </InputWrapper>
          </FormGroup>

          <Row>
            <FormGroup>
              <Label>Quantity</Label>
              <InputWrapper>
                <IconWrapper><Hash size={18} /></IconWrapper>
                <Input 
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                />
              </InputWrapper>
            </FormGroup>
            <FormGroup>
              <Label>Price (Optional)</Label>
              <InputWrapper>
                <IconWrapper><IndianRupee size={18} /></IconWrapper>
                <Input 
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </InputWrapper>
            </FormGroup>
          </Row>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>Cancel</CancelButton>
            <CreateButton type="submit" disabled={loading || !name.trim()}>
              <Check size={18} />
              <span>{loading ? 'Adding...' : 'Add to List'}</span>
            </CreateButton>
          </ButtonGroup>
        </Form>
      </ModalCard>
    </ModalOverlay>
  );
};

export default AddItemModal;
