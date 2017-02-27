import * as React from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';

export interface Props {
  onChange: any; //tslint:disable-line
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 40,
    border: 'none'
  }
});

const Search: React.StatelessComponent<Props> = ({ onChange }) => (
  <input
    className={css(styles.input)}
    onChange={onChange}
    placeholder="Search monument, country or region"/>
);

export default Search;
