import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { routers } from './route.tsx';

const router = routers;
createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}></RouterProvider>
);
