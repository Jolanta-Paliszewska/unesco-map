import * as React from 'react';
import { Monument } from '../reducers/index';
import * as moment from 'moment';
import { StyleSheet, css } from 'aphrodite/no-important';

export interface Props {
  monument: Monument;
  onMouseEnter: React.MouseEventHandler<HTMLElement>;
  onMouseLeave: React.MouseEventHandler<HTMLElement>;
  onClick: React.MouseEventHandler<HTMLElement>;
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 16,
    borderTop: '1px solid grey',
    borderBottom: '1px solid grey',
    cursor: 'pointer'
  },
  flag: {
    flex: 1
  },
  description: {
    flex: 8
  },
  image: {
    flex: 3,
    display: 'flex',
    alignItems: 'center'
  }
});

const MonumentItem: React.StatelessComponent<Props> = ({ monument, onMouseEnter, onMouseLeave, onClick }) => (
  <div
    className={css(styles.container)}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}>
    <div className={css(styles.flag)}/>
    <div className={css(styles.description)}>
      <h1>{ monument.site }</h1>
      <div>{ monument.states } | { moment(monument.date_inscribed).format('YYYY') }</div>
    </div>
    <div className={css(styles.image)}>
      <img src={monument.image_url}/>
    </div>
  </div>
);

export default MonumentItem;
