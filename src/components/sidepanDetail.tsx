import * as React from 'react';
import { connect } from 'react-redux';
import { Monument, State } from '../reducers/index';
import { StyleSheet, css } from 'aphrodite/no-important';
import * as moment from 'moment';
import Slider from './slider';
import { fetchMonument } from '../actions/monument';

export interface Props {
  monument: Monument;
  fetchMonument: (id: string) => void;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
});

class SidepanDetail extends React.Component<Props, void> {
  public componentWillMount() {
    const { monument } = this.props;

    if (monument) {
      this.props.fetchMonument(monument.id);
    }
  }

  public render() {
    const { monument } = this.props;

    if (!monument) {
      return null;
    }

    return (
      <div className={css(styles.container)}>
        <div>
          { monument.pictures && <Slider pictures={monument.pictures}/> }
        </div>
        <div>{ monument.states }, { moment(monument.date_inscribed).format('YYYY') }</div>
        <h1>{monument.site}</h1>
        <div>{ monument.region }</div>
        <div>
          { monument.long_description }
        </div>
      </div>
    );
  }
}

export default connect<any, any, any>((state: State, props: any) => ({
  monument: state.monuments[props.params.id]
}), dispatch => ({
  fetchMonument: (id: string) => dispatch(fetchMonument(id))
}))(SidepanDetail);
