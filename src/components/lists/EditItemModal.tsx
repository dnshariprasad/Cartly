import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Check, Package, Tag, Hash, IndianRupee, AlignLeft } from 'lucide-react';
import { type Item } from '../../types';

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
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const SaveButton = styled.button`
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
  item: Item;
  onUpdate: (itemId: string, data: Partial<Item>) => Promise<void>;
}

const EditItemModal: React.FC<Props> = ({ isOpen, onClose, item, onUpdate }) => {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [quantity, setQuantity] = useState(item.quantity);
  const [price, setPrice] = useState(item.price?.toString() || '');
  const [notes, setNotes] = useState(item.notes || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(item.name);
    setCategory(item.category);
    setQuantity(item.quantity);
    setPrice(item.price?.toString() || '');
    setNotes(item.notes || '');
  }, [item]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onUpdate(item.id, {
        name,
        category,
        quantity: Number(quantity),
        price: price ? Number(price) : 0,
        notes
      });
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
        <ModalHeader>
          <ModalTitle>Edit Item</ModalTitle>
          <button onClick={onClose}><X size={20} /></button>
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Item Name</Label>
            <InputWrapper>
              <IconWrapper><Package size={18} /></IconWrapper>
              <Input 
                placeholder="e.g. Whole Milk" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
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

          <FormGroup>
            <Label>Notes (Optional)</Label>
            <InputWrapper>
              <IconWrapper style={{ top: '0.75rem' }}><AlignLeft size={18} /></IconWrapper>
              <TextArea 
                placeholder="Add some notes..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </InputWrapper>
          </FormGroup>

          <ButtonGroup>
            <button type="button" onClick={onClose}>Cancel</button>
            <SaveButton type="submit" disabled={loading || !name.trim()}>
              <Check size={18} />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </SaveButton>
          </ButtonGroup>
        </Form>
      </ModalCard>
    </ModalOverlay>
  );
};

export default EditItemModal;
