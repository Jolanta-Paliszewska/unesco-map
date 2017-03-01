import * as React from 'react';
import { Monument } from '../reducers/index';
import * as moment from 'moment';
import { StyleSheet, css } from 'aphrodite/no-important';
import { colors } from '../style';

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
    borderTop: `1px solid ${colors.lightGrey}`,
    borderBottom: `1px solid ${colors.lightGrey}`,
    cursor: 'pointer'
  },
  flag: {
    flex: 1
  },
  description: {
    flex: 8
  },
  second: {
    color: colors.grey,
    fontWeight: 300,
    marginTop: 6,
    lineHeight: '16px'
  },
  image: {
    flex: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10
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
      <div className={css(styles.second)}>{ monument.states } | { moment(monument.date_inscribed).format('YYYY') }</div>
    </div>
    <div className={css(styles.image)}>
      <img src={monument.image_url}/>
    </div>
  </div>
);

export default MonumentItem;
