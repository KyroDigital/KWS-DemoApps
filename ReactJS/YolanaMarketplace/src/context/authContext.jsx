import React, { createContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { auth } from '../App';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { getDatabase, onValue, ref, set, get } from 'firebase/database';
import {
  authLoginAPI,
  getDeveloperUserDetails,
  getUserAPI,
  registerUserOnkyro,
} from 'services';
import { isObject } from 'helpers';

export const AuthContext = createContext({
  currentUser: null,
  isLoading: true,
});

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userExtraObj, setUserExtraObj] = useState(null);
  const [developerUser, setDeveloperUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const updateDeveloperUser = async () => {
      await authLoginAPI();
      const res = await getUserAPI();
      setDeveloperUser(res);
      setLoading(false);
    };
    updateDeveloperUser();
  }, []);
  console.log({ currentUser });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log({ user });
      if (user) {
        const db = getDatabase();
        const userRef = ref(db, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data.mode === process.env.REACT_APP_ENV_MODE) {
            setCurrentUser({ ...user, ...data });
            getActiveUserDetails(user.uid);
          }
        });
      }
    });
  }, []);

  const getActiveUserDetails = async (id) => {
    const data = await getDeveloperUserDetails(id);
    if (data) {
      console.log({ data });
      setUserExtraObj(data);
    }
  };

  const signUp = async (formData) => {
    try {
      const params = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        mode: process.env.REACT_APP_ENV_MODE,
      };
      const res = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      console.log('line 76', res);
      const uid = res.user.uid;
      const data = await registerUserOnkyro({ ...params, uid });
      if (data) {
        params.kyro_id = data.id;
      }
      const db = getDatabase();
      set(ref(db, 'users/' + uid), params);
      getActiveUserDetails(uid);
      return res;
    } catch (error) {
      let message = 'Registration Failed';
      console.log('Registration Error', error.code);
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email already exist.';
      }
      throw { message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (isObject(res.user)) {
        const db = getDatabase();
        const snapshot = await get(ref(db, '/users/' + res.user.uid));
        const value = snapshot.val();
        if (value.mode === process.env.REACT_APP_ENV_MODE) {
          return { status: 'success' };
        } else {
          throw { code: 'auth/user-not-found' };
        }
      }
    } catch (error) {
      let message = 'Login Failed';
      if (
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        message = 'Incorrect username or password.';
      }
      console.log('Login Error', { error });
      throw { message };
    }
  };

  const logOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setCurrentUser(null);
      setUserExtraObj(null);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const values = useMemo(
    () => ({
      currentUser,
      userExtraObj,
      developerUser,
      isLoading,
      signUp,
      signIn,
      logOut,
    }),
    [
      currentUser,
      userExtraObj,
      developerUser,
      isLoading,
      signUp,
      signIn,
      logOut,
    ],
  );

  console.log('line 122', { currentUser }, { developerUser });
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

AuthContextProvider.propTypes = {
  children: PropTypes.node,
};
