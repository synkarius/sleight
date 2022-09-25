import React from 'react';
import { Container } from 'brandi';

export const InjectionContext = React.createContext<
  Readonly<Container> | undefined
>(undefined) as React.Context<Readonly<Container>>;
