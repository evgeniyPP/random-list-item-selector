import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import Selector from './Selector.tsx';
import './index.css';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/selector', element: <Selector /> },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
