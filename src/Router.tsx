import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Container } from '@/layouts';
import { Dashboard, Registration } from '@/pages';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Container,
    children: [
      { index: true, Component: Dashboard },
      { path: 'new', Component: Registration },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
