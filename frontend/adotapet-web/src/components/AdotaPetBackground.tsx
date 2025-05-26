import React, { ReactNode } from 'react';
import './AdotaPetBackground.css';

interface Props {
  children: ReactNode;
}

const AdotaPetBackground: React.FC<Props> = ({ children }) => {
  return <div className="adotapet-background">{children}</div>;
};

export default AdotaPetBackground;
