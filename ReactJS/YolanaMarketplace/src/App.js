import './App.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { NavigationScroll } from 'components';
import Routes from 'routes';
import {
  AuthContextProvider,
  GlobalContextProvider,
  ThemeContextProvider,
} from 'context';
import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FIREBASE_CONFIG } from 'utils';
import { useEffect, useState } from 'react';
import { isObject } from 'helpers';
import { getAppObject } from 'services';

const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

var stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);
if (process.env.NODE_ENV === 'production') {
  console.log = function no_console() {};
}
function App() {
  const [isReady, setReady] = useState(false);
  const [app, setApp] = useState({});

  useEffect(() => {
    const fetchApp = async () => {
      const app = await getAppObject();
      isObject(app) ? setApp(app) : {};
    };
    fetchApp();
  }, []);

  return (
    <ThemeContextProvider appTheme={app}>
      <GlobalContextProvider>
        <AuthContextProvider>
          <NavigationScroll>
            <Elements stripe={stripePromise}>
              <Routes />
            </Elements>
          </NavigationScroll>
        </AuthContextProvider>
      </GlobalContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
