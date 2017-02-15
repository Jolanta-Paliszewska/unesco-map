import * as React from 'react';
import { Layer, Feature, Map } from 'react-mapbox-gl';
import { MapEvent } from 'react-mapbox-gl/lib/map';

import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { getMonuments } from '../actions/monument';
import { State, MonumentDict } from '../reducers/index';

interface Props {
  getMonuments: (latlng: number[][]) => any;
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

  private BoundsChanged = debounce<MapEvent>((map) => {
    const bounds = map.getBounds();
    this.props.getMonuments([[bounds.getSouth(), bounds.getWest()], [bounds.getNorth(), bounds.getEast()]]);
  }, 500, { leading: true });

  private layout = {
    'icon-image': 'marker-15'
  };

  private zoom = [6];

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
  getMonuments: (latlng: number[][]) => dispatch(getMonuments(latlng))
}))(Main);
