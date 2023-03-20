import { Suspense } from 'react';
import { Loader } from './loader';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

export const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );
