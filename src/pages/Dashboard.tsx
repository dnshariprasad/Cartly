import React from 'react';
import styled from 'styled-components';
import { Plus, Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useLists } from '../hooks/useLists';
import ListCard from '../components/lists/ListCard';
import { setCreateModalOpen } from '../store/slices/uiSlice';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ListGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const LoadingGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SkeletonCard = styled.div`
  height: 72px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  animation: pulse 1.5s infinite ease-in-out;

  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 0.3; }
    100% { opacity: 0.6; }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  gap: 1rem;
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 700;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 0;
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const dispatch = useDispatch();
  const { lists, loading } = useLists();

  const filteredLists = lists.filter(list => 
    list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  React.useEffect(() => {
    document.title = 'Cartly | Dashboard';
  }, []);


  return (
    <Container>


      <div>
        <SearchContainer style={{ marginBottom: 0 }}>
          <SearchIconWrapper>
            <Search size={20} />
          </SearchIconWrapper>
          <SearchInput 
            placeholder="Search your lists..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </div>

        {loading ? (
          <LoadingGrid>
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </LoadingGrid>
        ) : filteredLists.length > 0 ? (
          <ListGrid>
            {filteredLists.map(list => (
              <ListCard key={list.id} list={list} />
            ))}
          </ListGrid>
        ) : (
          <EmptyState>
            <div style={{ padding: '24px', borderRadius: '50%', backgroundColor: '#6366f110', color: '#6366f1' }}>
              <Plus size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
              {searchTerm ? 'No matches found' : 'No lists yet'}
            </h3>
            <p style={{ color: '#64748b', maxWidth: '300px', margin: '0 auto' }}>
              {searchTerm 
                ? `We couldn't find any lists matching "${searchTerm}"`
                : 'Create your first shopping list to start organizing your items.'}
            </p>
            {!searchTerm && (
              <PrimaryButton onClick={() => dispatch(setCreateModalOpen(true))} style={{ marginTop: '1rem' }}>
                <Plus size={20} />
                <span>Create Your First List</span>
              </PrimaryButton>
            )}
          </EmptyState>
        )}
    </Container>
  );
};

export default Dashboard;
