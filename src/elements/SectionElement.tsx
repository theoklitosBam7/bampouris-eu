import React from 'react';
import useThemeContext from '@theme/hooks/useThemeContext';

import { SectionElementProps } from '../models/SectionElementProps';

export function SectionElement(props: SectionElementProps): JSX.Element {
  const { isDarkTheme } = useThemeContext();

  return (
    <div className={`${props.elemClass} ${isDarkTheme ? props.darkThemeCls : props.lightThemeCls}`}>
      {props.children}
    </div>
  );
}
