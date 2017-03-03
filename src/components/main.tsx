import * as React from 'react';
import { MapEvent } from 'react-mapbox-gl/lib/map';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { getMonuments } from '../actions/monument';
import { MonumentDict, State } from '../reducers/index';
import UnescoMap from './map';
import { css, StyleSheet } from 'aphrodite/no-important';
import { browserHistory, RouteComponentProps } from 'react-router';
import { Props as SidepanListProps } from './sidepanList';
import { RouteProps } from './sidepanDetail';
import SidepanContainer from './sidepanContainer';
import { fetchMonument } from '../actions/monument';

interface Props {
  getMonuments: (latlng: number[]) => any;
  monuments: MonumentDict;
  fetchMonument: (id: string) => any;
}

interface StateComp {
  filteredMonuments: string[];
  hoveredItem: string;
  center: [number, number];
  zoom: number[];
};

const styles = StyleSheet.create({
  container: {
    display: 'flex'
  }
});

const defaultZoom = [6];
const defaultCenter = [-0.2416815, 51.5285582] as [number, number];

class Main extends React.Component<Props & RouteComponentProps<RouteProps, void>, StateComp> {
  private maxBounds: number[] = [];

  public state = {
    hoveredItem: '',
    zoom: defaultZoom,
    center: defaultCenter,
    filteredMonuments: []
  };

  public componentWillMount() {
    const { location, fetchMonument, params } = this.props;

    if (location.pathname.includes('detail')) {
      fetchMonument(params.id).then(() => {
        this.setState({
          center: this.props.monuments[params.id].latlng as [number, number],
          zoom: [11]
        });
      });
    }

    browserHistory.listen((ev) => {
      if (!ev.pathname.includes('detail')) {
        this.setState({
          zoom: defaultZoom
        });
      }
    });
  }

  private mapInit: MapEvent = (map) => {
    const bounds = map.getBounds();
    const boundsArr = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()];

    this.props.getMonuments(boundsArr).then(() => {
      this.setMonuments(boundsArr);
    });
  };

  private setMonuments = (bounds: number[]) => {
    const { monuments } = this.props;

    this.setState({
      filteredMonuments: Object.keys(monuments).filter(k => {
        const lat = monuments[k].latitude;
        const long = monuments[k].longitude;

        return lat > bounds[0] && long > bounds[1] && lat < bounds[2] && long < bounds[3];
      })
    });
  };

  private setMaxBounds = (bounds: number[]): boolean => {
    let newBounds;
    let isDifferent = false;

    if (this.maxBounds.length > 0) {
      newBounds = this.maxBounds.map((b, i) => {
        if (i < 2) {
          if (bounds[i] < b) {
            isDifferent = true;
            return bounds[i];
          } else {
            return b;
          }
        }
        if (bounds[i] > b) {
          isDifferent = true;
          return bounds[i];
        }
        return b;
      });
    } else {
      isDifferent = true;
      newBounds = bounds;
    }

    this.maxBounds = newBounds;

    return isDifferent;
  };

  private BoundsChanged: MapEvent = debounce((map: any) => {
    const bounds = map.getBounds();
    const boundsArr = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()];
    const isGreaterThanMaxBounds = this.setMaxBounds(boundsArr);

    this.setMonuments(boundsArr);

    if (isGreaterThanMaxBounds) {
      this.props.getMonuments(boundsArr);
    }
  }, 300);

  private onMouseEnter = (key: string) => {
    this.setState({
      hoveredItem: key
    });
  }

  private onMouseLeave = () => {
    this.setState({
      hoveredItem: ''
    });
  }

  private onMonumentClick = (k: string) => {
    const selectedMonument = this.props.monuments[k];

    this.setState({
      center: selectedMonument.latlng as [number, number],
      zoom: [11]
    });

    this.props.fetchMonument(k);

    setTimeout(() => {
      browserHistory.replace(`/detail/${k}`);
    }, 500);
  };

  public render() {
    const { monuments, children } = this.props;
    const { zoom, center, hoveredItem, filteredMonuments } = this.state;

    return (
      <div className={css(styles.container)}>
        <SidepanContainer>
        {
          React.cloneElement((children as React.ReactElement<SidepanListProps>), {
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave,
            filteredMonuments: filteredMonuments as string[],
            onSelectItem: this.onMonumentClick
          })
        }
        </SidepanContainer>
        <UnescoMap
          zoom={zoom}
          center={center}
          hoveredItem={hoveredItem}
          monuments={monuments}
          BoundsChanged={this.BoundsChanged}
          mapInit={this.mapInit}
          onMonumentClick={this.onMonumentClick}
        />
      </div>
    );
  }
}

export default connect((state: State) => ({
  monuments: state.monuments
}), dispatch => ({
  getMonuments: (latlng: number[]) => dispatch(getMonuments(latlng)),
  fetchMonument: (id: string) => dispatch(fetchMonument(id))
}))(Main);
