import React from 'react';

export const RequiredAsteriskComponent: React.FC<{ required: boolean }> = (
  props
) => {
  return <>{props.required && <span className="text-danger"> *</span>}</>;
};
