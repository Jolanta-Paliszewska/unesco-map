import * as React from 'react';
import { Picture } from '../reducers/index';

export interface Props {
  pictures: Picture[];
}

const Slider: React.StatelessComponent<Props> = ({ pictures }) => (
  <div>
    {
      pictures.map(picture => <img src={picture.url}/>)
    }
  </div>
);

export default Slider;
