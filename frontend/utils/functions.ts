import React from 'react';

export const preventEnterSubmitting = (event: React.KeyboardEvent): void => {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
};