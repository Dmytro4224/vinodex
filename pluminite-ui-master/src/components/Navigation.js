import React from 'react';
import styled from 'styled-components';

import { Left, Right } from './NavigationComponents';

const Container = styled('header')`
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 24px;

  @media (min-width: 767px) {
    justify-content: space-between;
    flex-direction: row;
  }
`;

export default function Navigation() {
  return (
    <Container>
      <Left />
      <Right />
    </Container>
  );
}
