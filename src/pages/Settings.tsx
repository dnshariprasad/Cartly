import React from 'react';
import styled from 'styled-components';
import { User, Sun, LogOut, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { toggleTheme } from '../store/slices/uiSlice';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
`;

const SectionHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: ${({ theme }) => `${theme.colors.background}50`};
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const SettingItem = styled.div`
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SettingLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const SettingDescription = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Toggle = styled.button<{ $active: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  position: relative;
  transition: all 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $active }) => ($active ? '22px' : '2px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    transition: all 0.2s ease;
  }
`;

const DangerButton = styled.button`
  color: ${({ theme }) => theme.colors.error};
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.error}10`};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
`;

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.ui.theme);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => signOut(auth);

  return (
    <Container>
      <Title>Settings</Title>

      <Section>
        <SectionHeader>
          <User size={18} />
          <SectionTitle>Profile</SectionTitle>
        </SectionHeader>
        <SettingItem>
          <UserInfo>
            <Avatar>
              {user?.displayName ? user.displayName[0].toUpperCase() : <User />}
            </Avatar>
            <SettingInfo>
              <SettingLabel>{user?.displayName || 'User'}</SettingLabel>
              <SettingDescription>{user?.email}</SettingDescription>
            </SettingInfo>
          </UserInfo>
          <button style={{ color: '#6366f1', fontWeight: 600, fontSize: '0.875rem' }}>Edit Profile</button>
        </SettingItem>
      </Section>

      <Section>
        <SectionHeader>
          <Sun size={18} />
          <SectionTitle>Appearance</SectionTitle>
        </SectionHeader>
        <SettingsList>
          <SettingItem>
            <SettingInfo>
              <SettingLabel>Dark Mode</SettingLabel>
              <SettingDescription>Use a dark theme for the application</SettingDescription>
            </SettingInfo>
            <Toggle $active={themeMode === 'dark'} onClick={() => dispatch(toggleTheme())} />
          </SettingItem>
        </SettingsList>
      </Section>

      <Section>
        <SectionHeader>
          <Shield size={18} />
          <SectionTitle>Account & Security</SectionTitle>
        </SectionHeader>
        <SettingsList>
          <SettingItem>
            <SettingInfo>
              <SettingLabel>Log Out</SettingLabel>
              <SettingDescription>Sign out of your account on this device</SettingDescription>
            </SettingInfo>
            <DangerButton onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </DangerButton>
          </SettingItem>
        </SettingsList>
      </Section>
    </Container>
  );
};

export default Settings;
