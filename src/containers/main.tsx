import * as React from 'react';
import { Layer, Feature, Map } from 'react-mapbox-gl';
import { MapEvent } from 'react-mapbox-gl/lib/map';

import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { getMonuments } from '../actions/monument';
import { State, MonumentDict } from '../reducers/index';

interface Props {
  getMonuments: (latlng: number[]) => any;
  monuments: MonumentDict;
}

const styles = {
  map: {
    height: '100vh',
    width: '100vw'
  }
};

const mapStyle = 'mapbox://styles/mapbox/streets-v8';
const accessToken = 'pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A';


class Main extends React.Component<Props, void> {
  private zoom: number[] = [6];
  private maxBounds: number[] = [];
  private layout = {
    'icon-image': 'marker-15'
  };

  private mapInit: MapEvent = (map) => {
    const bounds = map.getBounds();
    const boundsArr = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()];
    this.props.getMonuments(boundsArr);
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

  private BoundsChanged = debounce<MapEvent>((map) => {
    const bounds = map.getBounds();
    const boundsArr = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()];
    const isGreaterThanMaxBounds = this.setMaxBounds(boundsArr);

    if (isGreaterThanMaxBounds) {
      this.props.getMonuments(boundsArr);
    }
  }, 100, { leading: true });

  private onMonumentClick = (k: string) => {
    console.log(this.props.monuments[k]);
  };

  public render() {
    const { monuments } = this.props;

    return (
      <Map
        zoom={this.zoom}
        style={mapStyle}
        accessToken={accessToken}
        containerStyle={styles.map}
        onZoom={this.BoundsChanged}
        onStyleLoad={this.mapInit}
        onMove={this.BoundsChanged}>
          <Layer
            type="symbol"
            id="marker"
            layout={this.layout}>
            {
              Object.keys(monuments).map(k => (
                <Feature onClick={this.onMonumentClick.bind(this, k)} coordinates={monuments[k].latlng} key={k}/>
              ))
            }
          </Layer>
      </Map>
    );
  }
}

export default connect((state: State) => ({
  monuments: state.monuments
}), dispatch => ({
  getMonuments: (latlng: number[]) => dispatch(getMonuments(latlng))
}))(Main);
