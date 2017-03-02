import * as React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite/no-important';
import { MonumentDict, State } from '../reducers/index';
import MonumentItem from './monumentItem';
import Search from './search';
import SidepanContainer from './sidepanContainer';
import Timeline from './timeline';

const styles = StyleSheet.create({
  container: {},
  sidebarBody: {
    flex: 1,
    display: 'flex',
    height: '92vh'
  }
});

export interface Props {
  filteredMonuments: string[];
  monuments: MonumentDict;
  onSelectItem: (key: string) => void;
}

class SidepanList extends React.Component<Props, void> {

  private onMouseEnter = (key: string) => {
    this.setState({
      hoveredItem: key
    });
  }

  private onMouseLeaveItem = () => {
    this.setState({
      hoveredItem: ''
    });
  }

  public render() {
    const { filteredMonuments, onSelectItem, monuments } = this.props;

    const monumentsFiltered = filteredMonuments
      .map((k: string) => monuments[k])
      .sort((a, b) => a.date_inscribed > b.date_inscribed ? -1 : 1);

    const dates = [...new Set(monumentsFiltered.map(monument => monument.date_inscribed))];

    return (
      <div className={css(styles.sidebarBody)}>
        <Timeline collection={dates}/>
        <SidepanContainer>
          <div className={css(styles.container)}>
            <Search onChange={() => null}/>
            {
              monumentsFiltered.map((monument, index) => (
                <MonumentItem
                  monument={monument}
                  key={index}
                  onClick={() => onSelectItem(monument.id)}
                  onMouseEnter={() => this.onMouseEnter(monument.id)}
                  onMouseLeave={() => this.onMouseLeaveItem()}/>
              ))
            }
          </div>
        </SidepanContainer>
      </div>
    );
  }
};

export default connect((state: State) => ({
  monuments: state.monuments
}))(SidepanList);
