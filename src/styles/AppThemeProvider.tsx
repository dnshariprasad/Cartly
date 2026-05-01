import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import type { RootState } from '../store';
import { GlobalStyles } from './GlobalStyles';
import { darkTheme, lightTheme } from './theme';

interface Props {
  children: React.ReactNode;
}

const AppThemeProvider: React.FC<Props> = ({ children }) => {
  const themeMode = useSelector((state: RootState) => state.ui.theme);
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
