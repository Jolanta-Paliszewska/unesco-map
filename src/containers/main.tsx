import * as React from 'react';
import { Layer, Feature, Map } from 'react-mapbox-gl';
import { MapEvent } from 'react-mapbox-gl/lib/map';

import { connect } from 'react-redux';
import { getMonuments } from '../actions/monument';
import { MonumentDict, State } from '../reducers/index';
import SidepanMotion from './sidepanMotion';
const mapStyle = require('../map.json'); //tslint:disable-line

interface Props {
  getMonuments: (latlng: number[]) => any;
  monuments: MonumentDict;
}

interface StateComp {
  selectedMarker: string;
  center: [number, number];
  zoom: number[];
};

const styles = {
  map: {
    height: '100vh',
    width: '100vw'
  }
};

const accessToken = 'pk.eyJ1IjoiYWxleDMxNjUiLCJhIjoiY2l6bjVhNmNzMDAwbjJxbnlsaHk0NDRzciJ9.FFqZuLjBHghDPkyp_1oMpA';

const defaultZoom = [6];
const defaultCenter = [-0.2416815, 51.5285582] as [number, number];

class Main extends React.Component<Props, StateComp> {
  private maxBounds: number[] = [];
  private layout = {
    'icon-image': 'marker-15'
  };

  public state = {
    selectedMarker: '',
    zoom: defaultZoom,
    center: defaultCenter
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

  private BoundsChanged: MapEvent = (map) => {
    const bounds = map.getBounds();
    const boundsArr = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()];
    const isGreaterThanMaxBounds = this.setMaxBounds(boundsArr);

    if (isGreaterThanMaxBounds) {
      this.props.getMonuments(boundsArr);
    }
  };

  private onMonumentClick = (k: string) => {
    const selectedMonument = this.props.monuments[k];

    this.setState({
      selectedMarker: k,
      center: selectedMonument.latlng as [number, number],
      zoom: [11]
    });
  };

  private unselectMonument = () => {
    this.setState({
      selectedMarker: '',
      zoom: defaultZoom
    });
  }

  private markerHover = (key: string, { map }: any) => {
      map.getCanvas().style.cursor = 'pointer';
  };

  private markerEndHover = (key: string, { map }: any) => {
      map.getCanvas().style.cursor = '';
  };

  public render() {
    const { monuments } = this.props;
    const { selectedMarker, zoom, center } = this.state;
    const selectedMonument = monuments[selectedMarker];

    return (
      <div>
        {
          selectedMonument && (
            <SidepanMotion
              onClose={this.unselectMonument}
              monument={selectedMonument}/>
          )
        }
        <Map
          zoom={zoom}
          center={center}
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
                  <Feature
                    onHover={this.markerHover.bind(this, k)}
                    onEndHover={this.markerEndHover.bind(this, k)}
                    onClick={this.onMonumentClick.bind(this, k)}
                    coordinates={monuments[k].latlng}
                    key={k}
                  />
                ))
              }
            </Layer>
        </Map>
      </div>
    );
  }
}

export default connect((state: State) => ({
  monuments: state.monuments
}), dispatch => ({
  getMonuments: (latlng: number[]) => dispatch(getMonuments(latlng))
}))(Main);
