import * as React from 'react';
import { Monument } from '../reducers/index';
import { StyleSheet, css } from 'aphrodite/no-important';

export interface Props {
  monument?: Monument;
  onClose: () => void;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
});

const Sidepan: React.StatelessComponent<Props> = ({ monument, onClose }) => monument ? (
  <div className={css(styles.container)}>
    <div onClick={onClose}>close</div>
    <h1>{monument.site}</h1>
  </div>
) : <div/>;

export default Sidepan;
