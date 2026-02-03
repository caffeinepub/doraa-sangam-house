import { useContext } from 'react';
import { CommerceContext, CommerceContextType } from '../commerce/CommerceProvider';

export function useCommerce(): CommerceContextType {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error('useCommerce must be used within CommerceProvider');
  }
  return context;
}
