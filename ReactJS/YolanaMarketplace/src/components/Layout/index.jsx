import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';

export const Layout = () => {
  return (
    <div className='wraper'>
      <Header />
      <Outlet />
    </div>
  );
};
