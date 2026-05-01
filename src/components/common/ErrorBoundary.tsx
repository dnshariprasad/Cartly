import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ErrorCard = styled.div`
  max-width: 500px;
  width: 100%;
  padding: 3rem 2rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background-color: ${({ theme }) => `${theme.colors.error}10`};
  color: ${({ theme }) => theme.colors.error};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  
  background-color: ${({ theme, $variant }) => 
    $variant === 'primary' ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $variant }) => 
    $variant === 'primary' ? 'white' : theme.colors.text};
  border: 1px solid ${({ theme, $variant }) => 
    $variant === 'primary' ? theme.colors.primary : theme.colors.border};

  &:hover {
    transform: translateY(-2px);
    background-color: ${({ theme, $variant }) => 
      $variant === 'primary' ? theme.colors.secondary : theme.colors.background};
  }
`;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container>
          <ErrorCard>
            <IconWrapper>
              <AlertTriangle size={40} />
            </IconWrapper>
            <Title>Something went wrong</Title>
            <Message>
              We've encountered an unexpected error. Don't worry, your data is safe in the cloud.
            </Message>
            <ButtonGroup>
              <Button $variant="secondary" onClick={() => window.location.reload()}>
                <RefreshCw size={18} />
                Try Again
              </Button>
              <Button $variant="primary" onClick={this.handleReset}>
                <Home size={18} />
                Back Home
              </Button>
            </ButtonGroup>
          </ErrorCard>
        </Container>
      );
    }

    return this.children;
  }
}

export default ErrorBoundary;
