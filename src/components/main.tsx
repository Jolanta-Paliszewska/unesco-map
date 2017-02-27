import * as React from 'react';
import { Layer, Feature, Map } from 'react-mapbox-gl';
import { MapEvent } from 'react-mapbox-gl/lib/map';
import { debounce } from 'lodash';

import { connect } from 'react-redux';
import { getMonuments, fetchMonument } from '../actions/monument';
import { MonumentDict, State } from '../reducers/index';
import SidepanContainer from './sidepanContainer';
import SidepanList from './sidepanList';
import MapPopup from './mapPopup';

const mapStyle = require('../map.json'); //tslint:disable-line

interface Props {
  getMonuments: (latlng: number[]) => any;
  fetchMonument: (id: string) => void;
  monuments: MonumentDict;
}

interface StateComp {
  selectedMarker: string;
  filteredMonuments: string[];
  hoveredItem: string;
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
      selectedMarker: k,
      center: selectedMonument.latlng as [number, number],
      zoom: [11]
    });

    this.props.fetchMonument(k);
  };

  private onHoverItem = (key: string) => {
    this.setState({
      hoveredItem: key
    });
  }

  private onMouseLeaveItem = () => {
    this.setState({
      hoveredItem: ''
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
    const { zoom, center, hoveredItem, filteredMonuments } = this.state;

    return (
      <div>
        <SidepanContainer>
          <SidepanList
            filteredMonuments={filteredMonuments}
            monuments={monuments}
            onSelectItem={this.onMonumentClick}
            onMouseEnter={this.onHoverItem}
            onMouseLeave={this.onMouseLeaveItem}/>
        </SidepanContainer>
        <Map
          zoom={zoom}
          center={center}
          style={mapStyle}
          accessToken={accessToken}
          containerStyle={styles.map}
          onZoom={this.BoundsChanged}
          onStyleLoad={this.mapInit}
          onMove={this.BoundsChanged}>
            {
              hoveredItem && (
                <MapPopup monument={monuments[hoveredItem]}/>
              )
            }
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
  getMonuments: (latlng: number[]) => dispatch(getMonuments(latlng)),
  fetchMonument: (id: string) => { dispatch(fetchMonument(id)) }
}))(Main);
