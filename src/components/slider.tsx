import * as React from 'react';
import * as SlickSlider from 'react-slick';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Picture } from '../reducers/index';
import Fullscreen from '../icons/fullscreen';
import Right from '../icons/right';
import Left from '../icons/left';

export interface Props {
  pictures: Picture[];
  onFullScreen?: React.ReactEventHandler<SVGElement>;
}

export interface State {}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    // width: '100%',
    height: 300,
    overflowY: 'hidden',
    overflowX: 'auto'
  },
  slider: {
    // width: '100%',
    height: '100%'
  },
  controls: {
    position: 'absolute',
    display: 'flex',
    right: 0,
    bottom: 0
  },
  icon: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 5,
    cursor: 'pointer',
    margin: 5
  }
});

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false
};

class Slider extends React.Component<Props, State> {
  private slider: any;

  private onPrev = () => {
    this.slider.slickPrev();
  }

  private onNext = () => {
    this.slider.slickNext();
  }

  public render() {
    const { pictures, onFullScreen } = this.props;

    return (
      <div className={css(styles.container)}>
        <SlickSlider {...settings} className={css(styles.slider)} ref={c => this.slider = c }>
          {
            pictures.map((picture, index) => (
              <img src={picture.url} key={index}/>
            ))
          }
        </SlickSlider>
        <div className={css(styles.controls)}>
          <div className={css(styles.icon)} onClick={this.onPrev}>
            <Left/>
          </div>
          <div className={css(styles.icon)} onClick={this.onNext}>
            <Right/>
          </div>
          <div className={css(styles.icon)}>
            <Fullscreen onClick={onFullScreen}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Slider;
