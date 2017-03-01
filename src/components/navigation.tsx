import * as React from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';

const styles = StyleSheet.create({
  container: {
    height: '8vh',
    backgroundColor: 'white'
  }
});

const Navigation: React.StatelessComponent<any> = () => (
  <div className={css(styles.container)}/>
);

export default Navigation;
