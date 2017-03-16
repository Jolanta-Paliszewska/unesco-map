import * as React from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import UnescoIcon from '../icons/unesco';
import Search from './search';

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: 'white',
    display: 'flex',
    boxShadow: 'inset 0 1px 0 0 #edeaea'
  },
  icon: {
    minWidth: 74,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectContainer: {
    width: 112,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  select: {
    flex: 1,
    border: 'none',
    maxWidth: 47,
    background: 'none'
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
          <div>
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
