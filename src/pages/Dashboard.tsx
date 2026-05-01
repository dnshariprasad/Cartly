import React from 'react';
import styled from 'styled-components';
import { Plus, List as ListIcon, Calendar, CheckCircle, AlertCircle, Search as SearchIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useLists } from '../hooks/useLists';
import ListCard from '../components/lists/ListCard';
import { setCreateModalOpen } from '../store/slices/uiSlice';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 2.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -1px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
`;

const IconWrapper = styled.div<{ $color: string }>`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background-color: ${({ $color }) => `${$color}15`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.span`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1;
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 0.25rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.75rem;
`;

const CreateCard = styled.button`
  height: 100%;
  min-height: 220px;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;
  background: transparent;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => `${theme.colors.primary}05`};
    transform: translateY(-4px);
  }
`;

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.75rem;
`;

const SkeletonCard = styled.div`
  height: 220px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 20px;
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
  margin-bottom: 2rem;
  position: relative;
  max-width: 500px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => `${theme.colors.primary}15`};
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
  const { lists, loading, error } = useLists();

  const filteredLists = lists.filter(list => 
    list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  React.useEffect(() => {
    document.title = 'Cartly | Dashboard';
  }, []);

  const totalItems = lists.reduce((acc, list) => acc + (list.itemCount || 0), 0);
  const totalCompleted = lists.reduce((acc, list) => acc + (list.completedCount || 0), 0);
  const totalPending = totalItems - totalCompleted;

  return (
    <Container>


      <div>
        <SearchContainer>
          <SearchIconWrapper>
            <SearchIcon size={20} />
          </SearchIconWrapper>
          <SearchInput 
            placeholder="Search your lists..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

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
      </div>
    </Container>
  );
};

export default Dashboard;
