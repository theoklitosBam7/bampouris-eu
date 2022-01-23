import { ReactNode } from 'react';

export interface SectionElementProps {
  children: ReactNode;
  elemClass?: string;
  lightThemeCls?: string;
  darkThemeCls?: string;
}
