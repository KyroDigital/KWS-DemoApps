import { useContext } from 'react';
import { ThemeContext } from 'context';

const useTheme = (Component) => (props) => {
  const contextData = useContext(ThemeContext);
  console.log({ contextData });
  return <Component {...props} {...contextData} />;
};

export default useTheme;
