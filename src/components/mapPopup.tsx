import * as React from 'react';
import { Popup } from 'react-mapbox-gl';
import { Monument } from '../reducers/index';
import { css, StyleSheet } from 'aphrodite/no-important';

export interface Props {
  monument: Monument;
}

const styles = StyleSheet.create({
  popup: {
    width: 200
  }
});

const offset = {
  x: 0,
  y: -100
};

const MapPopup: React.StatelessComponent<Props> = ({ monument }) => (
  <Popup
    coordinates={monument.latlng}
    anchor="bottom"
    offset={offset}
    className={css(styles.popup)}>
    <div>
      <img src={monument.image_url}/>
    </div>
    <h1>{ monument.site }</h1>
  </Popup>
);

export default MapPopup;
