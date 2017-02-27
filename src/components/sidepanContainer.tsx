import * as React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';

const sidepanWidth = 400;

const styles = StyleSheet.create({
  sidepan: {
    zIndex: 10,
    width: sidepanWidth,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    borderRight: '1px solid rgb(80%, 80%, 80%)'
  }
});

export interface Props {
  children?: JSX.Element;
}

const SidepanContainer: React.StatelessComponent<Props> = ({ children }) => (
  <div className={css(styles.sidepan)}>
    { children }
  </div>
);

export default SidepanContainer;
