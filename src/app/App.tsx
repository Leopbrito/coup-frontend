import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useGameStore } from './store/gameStore';

export default function App() {
  const store = useGameStore();
  
  useEffect(() => {
    // Connect to the backend
    if ('connectSocket' in store) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      (store as any).connectSocket(API_URL);
    }
  }, [store]);

  return <RouterProvider router={router} />;
}
