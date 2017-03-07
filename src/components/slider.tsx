import * as React from 'react';
import * as SlickSlider from 'react-slick';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Picture } from '../reducers/index';
import Fullscreen from '../icons/fullscreen';

export interface Props {
  pictures: Picture[];
}

export interface State {}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 300,
    overflowY: 'hidden',
    overflowX: 'auto'
  },
  slider: {
    width: '100%',
    height: '100%'
  },
  controls: {
    position: 'absolute',
    right: 20,
    bottom: 20
  }
});

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

const controls = [Fullscreen];

class Slider extends React.Component<Props, State> {
  public render() {
    const { pictures } = this.props;

    return (
      <div className={css(styles.container)}>
        <SlickSlider {...settings} className={css(styles.slider)}>
          {
            pictures.map((picture, index) => (
              <img src={picture.url} key={index}/>
            ))
          }
        </SlickSlider>
        <div className={css(styles.controls)}>
          {
            controls.map(Icon =>
              <Icon/>
            )
          }
        </div>
      </div>
    );
  }
}

export default Slider;
