import * as React from 'react';
import MapPopup from './mapPopup';
import { Layer, Feature, Map } from 'react-mapbox-gl';
import { MonumentDict } from '../reducers/index';
import { MapEvent } from 'react-mapbox-gl/lib/map';

const accessToken = 'pk.eyJ1IjoiYWxleDMxNjUiLCJhIjoiY2l6bjVhNmNzMDAwbjJxbnlsaHk0NDRzciJ9.FFqZuLjBHghDPkyp_1oMpA';
const styles = {
  map: {
    height: '100vh',
    width: '70vw'
  }
};

export interface Props {
  monuments: MonumentDict;
  BoundsChanged: MapEvent;
  mapInit: MapEvent;
  center: [number, number];
  zoom: number[];
  hoveredItem: string;
  onMonumentClick: (k: string) => void;
}

class UnescoMap extends React.Component<Props, void> {
  private layout = {
    'icon-image': 'monument'
  };

  private markerHover = (key: string, { map }: any) => {
      map.getCanvas().style.cursor = 'pointer';
  };

  private markerEndHover = (key: string, { map }: any) => {
      map.getCanvas().style.cursor = '';
  };

  public render() {
    const { monuments, BoundsChanged, mapInit, center, zoom, hoveredItem, onMonumentClick } = this.props;

    return (
      <Map
        zoom={zoom}
        center={center}
        style="mapbox://styles/alex3165/cizu1cw8j00fl2st69h0lbmj6"
        accessToken={accessToken}
        containerStyle={styles.map}
        onZoom={BoundsChanged}
        onStyleLoad={mapInit}
        onMove={BoundsChanged}>
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
                  onClick={onMonumentClick.bind(this, k)}
                  coordinates={monuments[k].latlng}
                  key={k}
                />
              ))
            }
          </Layer>
      </Map>
    );
  }
};

export default UnescoMap;
