import { lazy } from 'react';
import { Outlet, useRoutes } from 'react-router-dom';
import { Layout, Loadable } from 'components';
import { NonProtectedRoute, ProtectedRoute } from './routeWrapper';

const Home = Loadable(lazy(() => import('../pages/home')));
const CreateNFT = Loadable(lazy(() => import('../pages/createNft')));
const NFTDetail = Loadable(lazy(() => import('../pages/nftDetail')));
const Checkout = Loadable(lazy(() => import('../pages/checkout')));
const SignUp = Loadable(lazy(() => import('../pages/signUp')));
const Login = Loadable(lazy(() => import('../pages/login')));

export default function Routes() {
  const routes = {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/create',
        element: (
          <ProtectedRoute>
            <CreateNFT />,
          </ProtectedRoute>
        ),
      },
      {
        path: '/details/:id',
        element: <NFTDetail />,
      },
      {
        path: '/checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
    ],
  };
  const authRoutes = {
    path: '/',
    element: <Outlet />,
    children: [
      {
        path: '/signup',
        element: (
          <NonProtectedRoute>
            <SignUp />
          </NonProtectedRoute>
        ),
      },
      {
        path: '/signin',
        element: (
          <NonProtectedRoute>
            <Login />
          </NonProtectedRoute>
        ),
      },
    ],
  };
  return useRoutes([routes, authRoutes]);
}
