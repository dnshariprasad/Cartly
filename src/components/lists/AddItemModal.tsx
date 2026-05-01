import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Check, Package, Tag, Hash, DollarSign } from 'lucide-react';

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
}

const AddItemModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Grocery');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
        <ModalHeader>
          <ModalTitle>Add New Item</ModalTitle>
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
                <IconWrapper><DollarSign size={18} /></IconWrapper>
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
            <button type="button" onClick={onClose}>Cancel</button>
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
