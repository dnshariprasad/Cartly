import React from 'react';
import styled from 'styled-components';
import { ShoppingBag } from 'lucide-react';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 1.5rem;
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
`;

const LogoIcon = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 16px ${({ theme }) => `${theme.colors.primary}40`};
`;

const LogoText = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9375rem;
`;

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <AuthContainer>
      <AuthCard>
        <Brand>
          <LogoIcon>
            <ShoppingBag size={32} />
          </LogoIcon>
          <div>
            <LogoText>Cartly</LogoText>
            <Subtitle>{subtitle}</Subtitle>
          </div>
        </Brand>
        {children}
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthLayout;
