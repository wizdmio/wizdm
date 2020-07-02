
// @see {https://ipinfo.io}
export const IP_INFO_IO = 'https://ipinfo.io/{{ip}}/json?token={{apiKey}}';

export interface IpInfoIO {

  ip: string;
  hostname?: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org?: string;
  postal: number;
  timezone: string;
  asn?: IpInfoAsn;
  company?: IpInfoCompany;
  privacy?: IpInfoPrivacy;
  readme?: string;
}

export interface IpInfoAsn {
  asn: string;
  name: string;
  domain: string;
  route: string;
  type: string;
}

export interface IpInfoCompany {
  name: string;
  domain: string;
  type: string;
}

export interface IpInfoPrivacy {
  vpn: boolean;
  proxy: boolean;
  tor: boolean;
  hosting: boolean;
}