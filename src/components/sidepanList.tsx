import * as React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Monument } from '../reducers/index';
import MonumentItem from './monumentItem';
import Search from './search';

const styles = StyleSheet.create({
  container: {}
});

export interface Props {
  filteredMonuments: Monument[];
  onMouseEnter: (key: string) => void;
  onMouseLeave: () => void;
  onSelectItem: (key: string) => void;
}

export default class SidepanList extends React.Component<Props, void> {
  public render() {
    const { onMouseEnter, onMouseLeave, filteredMonuments, onSelectItem } = this.props;

    return (
      <div className={css(styles.container)}>
        <Search onChange={() => null}/>
        {
          filteredMonuments.map((monument, index) => (
            <MonumentItem
              monument={monument}
              key={index}
              onClick={() => onSelectItem(monument.id)}
              onMouseEnter={() => onMouseEnter(monument.id)}
              onMouseLeave={() => onMouseLeave()}/>
          ))
        }
      </div>
    );
  }
};
