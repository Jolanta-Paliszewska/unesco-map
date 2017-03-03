import * as React from 'react';
import { connect } from 'react-redux';
import Navigation from './navigation';
import { RouteComponentProps } from 'react-router';
import { Monument, State } from '../reducers/index';
import { StyleSheet, css } from 'aphrodite/no-important';
import * as moment from 'moment';
import Slider from './slider';
import { fetchMonument } from '../actions/monument';
import { colors } from '../style';

export interface Props {
  monument: Monument;
  fetchMonument: (id: string) => void;
}

export interface RouteProps {
  id: string;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  monumentDetails: {
    padding: '20px 32px',
    flex: 1
  },
  leading: {
    color: colors.darkBlue
  },
  title: {
    color: colors.darkBlue,
    fontSize: 24,
    lineHeight: '40px'
  },
  region: {
    color: colors.grey,
    fontWeight: 400
  },
  description: {
    fontSize: 16,
    fontWeight: 300,
    color: colors.darkBlue,
    marginTop: 12,
    lineHeight: '22px'
  }
});

class SidepanDetail extends React.Component<Props & RouteComponentProps<RouteProps, void>, void> {
  public componentWillMount() {
    const { params } = this.props;

    this.props.fetchMonument(params.id);
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
        <div className={css(styles.monumentDetails)}>
          <div className={css(styles.leading)}>
            { monument.states }, { moment(monument.date_inscribed).format('YYYY') }
          </div>
          <h1 className={css(styles.title)}>{monument.site}</h1>
          <div className={css(styles.region)}>{ monument.region }</div>
          <div className={css(styles.description)}>
            { monument.short_description }
          </div>
        </div>
        <Navigation/>
      </div>
    );
  }
}

export default connect<any, any, any>((state: State, props: any) => ({
  monument: state.monuments[props.params.id]
}), dispatch => ({
  fetchMonument: (id: string) => dispatch(fetchMonument(id))
}))(SidepanDetail);
