
// @see {https://iplist.cc}
export const IP_LIST_CC = 'https://iplist.cc/api/{{ip}}';

export interface IpListCC {
  ip: string;
  registry: string,
  countrycode: string,
  countryname: string,
  asn?: IpListAsn;
  detail: string;
  spam: boolean;
  tor: boolean;
}

export interface IpListAsn {
  code: number;
  name: string;
  route: string;
  start: string;
  end: string;
  count: number;
}