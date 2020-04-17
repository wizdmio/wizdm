
// @see {https://www.geojs.io/}
export const GEO_JS_IO = 'https://get.geojs.io/v1/ip/geo/{{ip}}.json';

export interface GeoJsIO {
  accuracy: number;
  area_code: string;
  asn: number;
  continent_code: string;
  country: string;
  country_code: string;
  country_code3: string;
  ip: string;
  latitude: string;
  longitude: string;
  organization: string;
  organization_name: string;
};