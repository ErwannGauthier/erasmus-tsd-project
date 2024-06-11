import React from 'react';

export const preventEnterSubmitting = (event: React.KeyboardEvent): void => {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
};

export const getAllTypesOfVotes = (): string[] => {
  return ['fibonacci', 'base2', 't-shirt'];
};

export const getTypeOfVotes = (type: string): string[] => {
  switch (type.toLowerCase()) {
    case 'fibonacci':
      return ['0', '1', '2', '3', '5', '8', '13', '20', '40', '100'];
    case 'base2':
      return ['0', '1', '2', '4', '8', '16', '32', '64', '128'];
    case 't-shirt':
      return ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
    default:
      return ['0', '1', '2', '3', '5', '8', '13', '20', '40', '100'];
  }
};