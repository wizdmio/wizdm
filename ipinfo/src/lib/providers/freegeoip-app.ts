
// @see {https://freegeoip.app}
export const FREE_GEO_IP_APP = 'https://freegeoip.app/json/{{ip}}';

export interface FreeGeoIpAPP {
  ip: string;
  country_code: string;
  country_name: string;
  region_code: string;
  region_name: string;
  city: string;
  zip_code: string;
  time_zone: string,
  latitude: string;
  longitude:string;
  metro_code: string;
}