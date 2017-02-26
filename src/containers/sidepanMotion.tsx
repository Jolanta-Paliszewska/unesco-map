import * as React from 'react';
import { Motion, spring } from 'react-motion';
import Sidepan, { Props } from './sidepan';
import { StyleSheet, css } from 'aphrodite/no-important';

const sidepanWidth = 400;

const styles = StyleSheet.create({
  sidepan: {
    zIndex: 10,
    width: sidepanWidth,
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    borderRight: '1px solid rgb(80%, 80%, 80%)'
  }
});

const SidepanMotion: React.StatelessComponent<Props> = (props) => (
  <Motion style={{ x: spring(!props.monument ? - sidepanWidth : 0) }}>
    {
      ({ x }: any) => (
        <div
        className={css(styles.sidepan)}
        style={{
          transform: `translate3d(${x}px, 0, 0)`,
          WebkitTransform: `translate3d(${x}px, 0, 0)`
        }}>
          <Sidepan {...props}/>
        </div>
      )
    }
  </Motion>
);

export default SidepanMotion;
