import { useContext } from 'react';
import { AuthContext } from 'context';

const useAuth = () => useContext(AuthContext);

export default useAuth;
