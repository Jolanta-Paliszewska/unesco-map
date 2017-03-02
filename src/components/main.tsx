import * as React from 'react';
import { MapEvent } from 'react-mapbox-gl/lib/map';
import { debounce } from 'lodash';

import { connect } from 'react-redux';
import { getMonuments } from '../actions/monument';
import { MonumentDict, State } from '../reducers/index';
import UnescoMap from './map';
import { css, StyleSheet } from 'aphrodite/no-important';
import Navigation from './navigation';
import { browserHistory } from 'react-router';

interface Props {
  getMonuments: (latlng: number[]) => any;
  monuments: MonumentDict;
}

interface StateComp {
  selectedMarker: string;
  filteredMonuments: string[];
  hoveredItem: string;
  center: [number, number];
  zoom: number[];
};

const styles = StyleSheet.create({
  container: {
    display: 'flex'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column'
  },
  sidebarBody: {
    flex: 1,
    display: 'flex',
    height: '92vh'
  }
});

const defaultZoom = [6];
const defaultCenter = [-0.2416815, 51.5285582] as [number, number];

class Main extends React.Component<Props, StateComp> {
  private maxBounds: number[] = [];

  public state = {
    selectedMarker: '',
    hoveredItem: '',
    zoom: defaultZoom,
    center: defaultCenter,
    filteredMonuments: []
  };

  private mapInit: MapEvent = (map) => {
    const bounds = map.getBounds();
    const boundsArr = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()];
    this.props.getMonuments(boundsArr);
    this.setMonuments(boundsArr);
  };

  private setMonuments = debounce((bounds: number[]) => {
    const { monuments } = this.props;

    this.setState({
      filteredMonuments: Object.keys(monuments).filter(k => {
        const lat = monuments[k].latitude;
        const long = monuments[k].longitude;

        return lat > bounds[0] && long > bounds[1] && lat < bounds[2] && long < bounds[3];
      })
    });
  }, 500);

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

  private BoundsChanged: MapEvent = (map) => {
    const bounds = map.getBounds();
    const boundsArr = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()];
    const isGreaterThanMaxBounds = this.setMaxBounds(boundsArr);

    if (isGreaterThanMaxBounds) {
      this.props.getMonuments(boundsArr);
    }

    this.setMonuments(boundsArr);
  };

  private onMonumentClick = (k: string) => {
    const selectedMonument = this.props.monuments[k];

    this.setState({
      center: selectedMonument.latlng as [number, number],
      zoom: [11]
    });

    browserHistory.push(`detail/${k}`);
  };

  public render() {
    const { monuments, children } = this.props;
    const { zoom, center, hoveredItem, filteredMonuments } = this.state;

    return (
      <div className={css(styles.container)}>
        <div className={css(styles.sidebar)}>
            {
              React.cloneElement((children as React.ReactElement<any>), {
                filteredMonuments,
                onSelectItem: this.onMonumentClick
              })
            }
          <Navigation/>
        </div>
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
  getMonuments: (latlng: number[]) => dispatch(getMonuments(latlng))
}))(Main);