import * as React from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import UnescoIcon from '../icons/unesco';
import Search from './search';
import { colors } from '../style';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    display: 'flex',
    borderBottom: '1px solid #edeaea',
    height: '6vh'
  },
  icon: {
    minWidth: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRight: '1px solid #edeaea'
  },
  label: {
    fontWeight: 400,
    color: colors.darkBlue
  },
  selectContainer: {
    width: 112,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeft: '1px solid #edeaea'
  },
  select: {
    flex: 1,
    border: 'none',
    background: 'none',
    outline: 'none',
    color: colors.darkBlue,
    fontSize: 12,
    maxWidth: 55
  }
});

export interface Props {
  onSearch: React.ReactEventHandler<HTMLElement>;
}
export interface State {}

class Navigation extends React.Component<Props, State> {

  public render() {
    const { onSearch } = this.props;

    return (
      <div className={css(styles.container)}>
        <div className={css(styles.icon)}>
          <UnescoIcon/>
        </div>
        <Search onChange={onSearch}/>
        <div className={css(styles.selectContainer)}>
          <div className={css(styles.label)}>
            Sort:
          </div>
          <select className={css(styles.select)}>
            <option>Year</option>
            <option>Countries</option>
            <option>Name</option>
          </select>
        </div>
      </div>
    );
  }
};

export default Navigation;
