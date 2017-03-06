import * as React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite/no-important';
import { MonumentDict, State as RootState} from '../reducers/index';
import MonumentItem from './monumentItem';
import Search from './search';
import Timeline from './timeline';
import Navigation from './navigation';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxHeight: '100vh',
    minHeight: '100%'
  },
  container: {
    display: 'flex',
    flex: 1
  },
  list: {
    maxHeight: '100vh',
    overflow: 'auto'
  }
});

export interface Props {
  filteredMonuments: string[];
  monuments: MonumentDict;
  onSelectItem: (key: string) => void;
  onMouseEnter: (key: string) => void;
  onMouseLeave: () => void;
}

export interface State {
  query: string;
}

class SidepanList extends React.Component<Props, State> {

  public state = {
    query: ''
  };

  private onSearch = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query: target.value
    });
  };

  public render() {
    const { filteredMonuments, onSelectItem, monuments, onMouseEnter, onMouseLeave } = this.props;
    const { query } = this.state;

    const monumentsFiltered = filteredMonuments
      .map((k: string) => monuments[k])
      .filter(monument => monument.site.toLowerCase().includes(query))
      .sort((a, b) => a.date_inscribed > b.date_inscribed ? -1 : 1);

    const dates = [...new Set(monumentsFiltered.map(monument => monument.date_inscribed))];

    return (
      <div className={css(styles.wrapper)}>
        <div className={css(styles.container)}>
          <Timeline collection={dates}/>
          <div className={css(styles.list)}>
            <Search onChange={this.onSearch}/>
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
        <Navigation/>
      </div>
    );
  }
};

export default connect((state: RootState) => ({
  monuments: state.monuments
}))(SidepanList);
