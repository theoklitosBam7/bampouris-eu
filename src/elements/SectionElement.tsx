import useThemeContext from '@theme/hooks/useThemeContext';
import React from 'react';

import { SectionElementProps } from '../models/SectionElementProps';

export function SectionElement(props: SectionElementProps): JSX.Element {
  const { isDarkTheme } = useThemeContext();

  return (
    <section className={`${props.elemClass} ${isDarkTheme ? props.darkThemeCls : props.lightThemeCls}`}>
      {props.children}
    </section>
  );
}
