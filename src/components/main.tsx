import * as React from 'react';
import { MapEvent } from 'react-mapbox-gl/lib/map';
import { debounce } from 'lodash';

import { connect } from 'react-redux';
import { getMonuments, fetchMonument } from '../actions/monument';
import { MonumentDict, State } from '../reducers/index';
import SidepanContainer from './sidepanContainer';
import SidepanList from './sidepanList';
import UnescoMap from './map';
import { css, StyleSheet } from 'aphrodite/no-important';
import SidepanDetail from './sidepanDetail';
import Timeline from './timeline';
import Navigation from './navigation';

interface Props {
  getMonuments: (latlng: number[]) => any;
  fetchMonument: (id: string) => any;
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

  public render() {
    const { monuments, fetchMonument } = this.props;
    const { zoom, center, hoveredItem, filteredMonuments, selectedMarker } = this.state;
    const monumentsFiltered = filteredMonuments
      .map((k: string) => monuments[k])
      .sort((a, b) => a.date_inscribed > b.date_inscribed ? -1 : 1);

    const dates = [...new Set(monumentsFiltered.map(monument => monument.date_inscribed))];

    return (
      <div className={css(styles.container)}>
        <div className={css(styles.sidebar)}>
          <div className={css(styles.sidebarBody)}>
            { !selectedMarker && <Timeline collection={dates}/> }
            <SidepanContainer>
              {
                selectedMarker ?
                (
                  <SidepanDetail
                    fetchMonument={fetchMonument}
                    monument={monuments[selectedMarker]}/>
                ) :
                (
                  <SidepanList
                    filteredMonuments={monumentsFiltered}
                    onSelectItem={this.onMonumentClick}
                    onMouseEnter={this.onHoverItem}
                    onMouseLeave={this.onMouseLeaveItem}/>
                )
              }

            </SidepanContainer>
          </div>
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
  getMonuments: (latlng: number[]) => dispatch(getMonuments(latlng)),
  fetchMonument: (id: string) => dispatch(fetchMonument(id))
}))(Main);
