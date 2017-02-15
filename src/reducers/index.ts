import { routerReducer as routing, RouterState } from 'react-router-redux';
import { combineReducers, Action } from 'redux';
import { SET_MONUMENTS } from '../constants/monument';

export interface Monument {
  id: string;
  id_number: number;
  category: 'Cultural' | 'Natural' | 'Mixed';
  created_at: string;
  updated_at: string;
  criteria_txt: string;
  danger: string | null;
  date_inscribed: string;
  extension: number;
  historical_description: string | null;
  http_url: string;
  image_url: string;
  iso_code: string;
  justification: string | null;
  latitude: number;
  longitude: number;
  latlng: number[];
  location: string;
  states: string;
  long_description: string;
  short_description: string;
  region: string;
  revision: number;
  secondary_dates: string;
  site: string;
  transboundary: number;
  unique_number: number;
}

export interface MonumentDict {
  [id: string]: Monument;
}

interface RThunkAction extends Action {
  payload: any;
};

export interface State {
  monuments: MonumentDict;
  routing: RouterState;
}

const monuments = (state: MonumentDict = {}, { type, payload }: RThunkAction) => {
  switch (type) {
    case SET_MONUMENTS: return {
      ...state,
      ...payload.data
        .map((monument: Monument) => ({
          ...monument,
          latlng: [monument.longitude, monument.latitude]
        }))
        .reduce((acc: MonumentDict, next: Monument) => {
          acc[next.id] = next;
          return acc;
        }, {})
    };
    default: return state;
  }
};

const reducers = combineReducers<State>({
  routing,
  monuments
});

export default reducers;
