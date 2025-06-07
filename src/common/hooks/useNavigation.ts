import { useContext } from 'react';
import NavigationContext from '../contexts/navigationContext';

const useNavigation = () => {
  return useContext(NavigationContext);
};

export default useNavigation;
