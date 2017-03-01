import * as React from 'react';
import { Picture } from '../reducers/index';
import { css, StyleSheet } from 'aphrodite/no-important';

export interface Props {
  pictures: Picture[];
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    overflow: 'hidden'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%'
  }
});

const Slider: React.StatelessComponent<Props> = ({ pictures }) => (
  <div className={css(styles.container)}>
    {
      pictures.map(picture => <img className={css(styles.image)} src={picture.url}/>)
    }
  </div>
);

export default Slider;
