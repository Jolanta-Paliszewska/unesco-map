import * as React from 'react';
import { Picture } from '../reducers/index';
import { css, StyleSheet } from 'aphrodite/no-important';

export interface Props {
  pictures: Picture[];
}

export interface State {
  current: number;
}

const galleryWidth = 420;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: galleryWidth,
    height: 300,
    overflow: 'hidden'
  },
  gallery: {
    display: 'flex'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    display: 'flex'
  }
});

class Slider extends React.Component<Props, State> {

  public state = {
    current: 0
  };

  private prev = () => {
    this.setState({
      current: this.state.current - 1
    });
  };

  private next = () => {
    this.setState({
      current: this.state.current + 1
    });
  };

  private full = () => {
    console.log(this.state.current);
  };

  public render() {
    const { pictures } = this.props;
    const { current } = this.state;

    return (
      <div className={css(styles.container)}>
        <div className={css(styles.gallery)} style={{ transform: `translateX(${current * galleryWidth})` }}>
          {
            pictures.map(picture => <img className={css(styles.image)} src={picture.url}/>)
          }
        </div>
        <div className={css(styles.controls)}>
          <div onClick={this.prev}>prev</div>
          <div onClick={this.next}>next</div>
          <div onClick={this.full}>full</div>
        </div>
      </div>
    );
  }
}

export default Slider;
