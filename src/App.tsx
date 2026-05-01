import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from './services/firebase';
import { setUser } from './store/slices/authSlice';
import type { RootState } from './store';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import ListDetail from './pages/ListDetail';
import Settings from './pages/Settings';
import MainLayout from './components/layout/MainLayout';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!auth) {
      dispatch(setUser(null));
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (isInitialLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Cartly...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
      
      <Route path="/" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="my-lists" element={<Dashboard />} />
        <Route path="list/:id" element={<ListDetail />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
