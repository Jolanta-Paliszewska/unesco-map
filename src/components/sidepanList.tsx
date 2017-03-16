import * as React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite/no-important';
import { MonumentDict, State as RootState} from '../reducers/index';
import MonumentItem from './monumentItem';
import Navigation from './navigation';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100vh'
  },
  list: {
    flex: 9,
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

    return (
      <div className={css(styles.wrapper)}>
        <Navigation onSearch={this.onSearch}/>
        <div className={css(styles.list)}>
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

export default connect((state: RootState) => ({
  monuments: state.monuments
}))(SidepanList);
