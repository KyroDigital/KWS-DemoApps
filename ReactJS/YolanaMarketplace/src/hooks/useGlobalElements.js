import { useContext } from 'react';
import { GlobalContext } from 'context';

const useGlobalElements = () => useContext(GlobalContext);

export default useGlobalElements;
