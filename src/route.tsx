import { createBrowserRouter } from 'react-router-dom';
import App from './App';

import MainPage from './page/main/MainPage';
import MainLayout from './page/main/MainLayout';

const main = {
  path: '/',
  element: <MainLayout />,
  children: [{ index: true, element: <MainPage /> }],
};
const routerConfig = [
  {
    path: '/',
    element: <App />,
    children: [main],
  },
];
export const routers = createBrowserRouter(routerConfig);
