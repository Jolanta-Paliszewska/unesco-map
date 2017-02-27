import { SET_MONUMENTS } from '../constants/monument';

const api = 'https://unesco-api.balek.io/api/monuments';

const req = (url: string, method = 'GET', body?: any) => new Request(url, {
  method,
  headers: new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Charset': 'utf-8'
  }),
  body
});

const selectedFields = [
  'id',
  'latitude',
  'longitude',
  'site',
  'image_url',
  'category',
  'states'
];

const buildMonumentsUrl = (latlng: number[]) => (
  `${api}?select=${selectedFields.join(',')}&latitude=gte.${latlng[0]}&longitude=gte.${latlng[1]}&latitude=lte.${latlng[2]}&longitude=lte.${latlng[3]}` //tslint:disable-line
);

const setMonuments = (data: any) => ({
  type: SET_MONUMENTS,
  payload: data
});

export const getMonuments = (latlng: number[]) => (dispatch: any) => (
  fetch(req(buildMonumentsUrl(latlng)))
    .then(res => res.json())
    .then((data) => dispatch(setMonuments(data)))
);

export const fetchMonument = (id: string) => (dispatch: any) => (
  fetch(req(`${api}?id=eq.${id}`))
    .then(res => res.json())
    .then((data) => dispatch(setMonuments(data)))
);
