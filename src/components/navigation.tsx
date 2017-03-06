import * as React from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import UnescoIcon from '../icons/unesco';
import { colors } from '../style';

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: 'white',
    display: 'flex',
    boxShadow: 'inset 0 1px 0 0 #edeaea'
  },
  menu: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    minWidth: 74,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    padding: '0px 16px',
    color: colors.grey,
    minWidth: 16,
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  selected: {
    color: colors.darkBlue,
    borderBottom: `2px solid ${colors.darkBlue}`
  }
});

const menu = [
  'Year',
  'Country',
  'Name'
];

export interface Props {}
export interface State {
  selected: number;
}

class Navigation extends React.Component<Props, State> {

  public state = {
    selected: 0
  };

  public render() {
    const { selected } = this.state;
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.icon)}>
          <UnescoIcon/>
        </div>
        <div className={css(styles.menu)}>
          {
            menu.map((item, index) => (
              <div key={item} className={css(styles.item, index === selected && styles.selected)}>
                { item }
              </div>
            ))
          }
        </div>
      </div>
    );
  }
};

export default Navigation;
