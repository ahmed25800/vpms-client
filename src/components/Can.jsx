import React from 'react';
import CheckHasPermission from './CheckHasPermission';

const Can = ({
  permission,
  children,
  fallback = null,
  behavior = 'hide',
}) => {
  const checkpermission = CheckHasPermission(permission);
  if (checkpermission) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  if (React.isValidElement(children)) {
    if (behavior === 'disable') {
      return React.cloneElement(children, {
        ...children.props, 
        disabled: true,    
      });
    }
  }
  return null;
};

export default Can;