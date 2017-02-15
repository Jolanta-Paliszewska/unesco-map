import { SET_MONUMENTS } from '../constants/monument';

const api = 'https://unesco-api.balek.io/monuments';

const req = (url: string, method = 'GET', body?: any) => new Request(url, {
  method,
  headers: new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Charset': 'utf-8'
  }),
  body
});

const buildMonumentUrl = (latlng: number[][]) => (
  `${api}?latitude=gte.${latlng[0][0]}&latitude=lte.${latlng[1][0]}&longitude=gte.${latlng[0][1]}&longitude=lte.${latlng[1][1]}` //tslint:disable-line
);

const setMonuments = (data: any) => ({
  type: SET_MONUMENTS,
  payload: data
});

export const getMonuments = (latlng: number[][]) => (dispatch: any) => (
  fetch(req(buildMonumentUrl(latlng)))
    .then(res => res.json())
    .then((data) => dispatch(setMonuments(data)))
);
