import { createBrowserRouter } from 'react-router-dom';
import App from './App';

import MainPage from './page/main/MainPage';

const routerConfig = [
  {
    path: '/',
    element: <App />,
    children: [{ index: true, element: <MainPage /> }],
  },
];
export const routers = createBrowserRouter(routerConfig, { basename: '/myBook' });
