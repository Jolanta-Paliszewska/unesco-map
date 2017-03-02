import * as React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite/no-important';
import { MonumentDict, State } from '../reducers/index';
import MonumentItem from './monumentItem';
import Search from './search';
import Timeline from './timeline';

const styles = StyleSheet.create({
  container: {
    display: 'flex'
  },
});

export interface Props {
  filteredMonuments: string[];
  monuments: MonumentDict;
  onSelectItem: (key: string) => void;
  onMouseEnter: (key: string) => void;
  onMouseLeave: () => void;
}

class SidepanList extends React.Component<Props, void> {
  public render() {
    const { filteredMonuments, onSelectItem, monuments, onMouseEnter, onMouseLeave } = this.props;

    const monumentsFiltered = filteredMonuments
      .map((k: string) => monuments[k])
      .sort((a, b) => a.date_inscribed > b.date_inscribed ? -1 : 1);

    const dates = [...new Set(monumentsFiltered.map(monument => monument.date_inscribed))];

    return (
      <div className={css(styles.container)}>
        <Timeline collection={dates}/>
        <div>
          <Search onChange={() => null}/>
          {
            monumentsFiltered.map((monument, index) => (
              <MonumentItem
                monument={monument}
                key={index}
                onClick={() => onSelectItem(monument.id)}
                onMouseEnter={() => onMouseEnter(monument.id)}
                onMouseLeave={() => onMouseLeave()}/>
            ))
          }
        </div>
      </div>
    );
  }
};

export default connect((state: State) => ({
  monuments: state.monuments
}))(SidepanList);
