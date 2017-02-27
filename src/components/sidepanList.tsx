import * as React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { MonumentDict } from '../reducers/index';
import MonumentItem from './monumentItem';
import Search from './search';

const styles = StyleSheet.create({
  container: {}
});

export interface Props {
  monuments: MonumentDict;
  filteredMonuments: string[];
  onMouseEnter: (key: string) => void;
  onMouseLeave: () => void;
  onSelectItem: (key: string) => void;
}

export default class SidepanList extends React.Component<Props, void> {
  public render() {
    const { monuments, onMouseEnter, onMouseLeave, filteredMonuments, onSelectItem } = this.props;

    return (
      <div className={css(styles.container)}>
        <Search onChange={() => null}/>
        {
          filteredMonuments.map(key => (
            <MonumentItem
              monument={monuments[key]}
              key={key}
              onClick={() => onSelectItem(key)}
              onMouseEnter={() => onMouseEnter(key)}
              onMouseLeave={() => onMouseLeave()}/>
          ))
        }
      </div>
    );
  }
};
