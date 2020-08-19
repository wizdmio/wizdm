import { InjectionToken } from '@angular/core';

export interface LanguageMap {
  [langCode: string]: string[];
};

/** Tree shakeabke map of languages by country code */
export const LANGUAGE_MAP = new InjectionToken<LanguageMap>('wizdm.language.map', {
  providedIn: 'root',
  factory: () => ({
    "AD": ["ca"],//	Andorra
    "AE":	["ar"],// United Arab Emirates
    "AF": ["fa", "ps"], // Afghanistan
    "AG":	["en"], // Antigua and Barbuda
    "AI": ["en"], // Anguilla
    "AL":	["sq"], // Albania
    "AM":	["hy"], // Armenia
    "AO":	["pt"], // Angola
    "AQ": ["en", "es", "fr", "ru"], // Antarctica
    "AR":	["es"], // Argentina
    "AS":	["en", "sm"], // American Samoa
    "AT":	["de"], // Austria
    "AU":	["en"], // Australia
    "AW":	["nl", "pap"],// Aruba
    "AX":	["sv"], // Aland Islands
    "AZ":	["az"], // Azerbaijan
    "BA":	["bs", "hr", "sr"], // Bosnia and Herzegovina
    "BB":	["en"], // Barbados
    "BD": ["bn"],	// Bangladesh
    "BE":	["nl", "fr", "de"], // Belgium
    "BF":	["fr"], // Burkina Faso
    "BG": ["bg"], // Bulgaria
    "BH": ["ar"], // Bahrein
    "BI": ["fr"], // Burundi
    "BJ": ["fr"], // Benin
    "BL":	["fr"], // Saint-Barthélemy
    "BM": ["en"], // Bermuda
    "BN":	["ms"], // Brunei Darussalam
    "BO": ["es", "qu", "gn", "ay"], // Bolivia
    "BQ":	["nl"], // Caribbean Netherlands
    "BR":	["pt"], // Brazil
    "BS": ["en"], // Bahamas
    "BT": ["dz"], // Bhutan
    "BV":	["no"], // Bouvet Island
    "BW": ["en", "tn"], // Botswana	Botswana
    "BY": ["be", "ru"],//	Belarus
    "BZ":	["en"], // Belize
    "CA":	["en", "fr"], // Canada
    "CC":	["en"], // Cocos (Keeling) Islands
    "CD":	["fr"], // Democratic Republic of the Congo (Congo-Kinshasa, former Zaire)
    "CF": ["fr", "sg"], // Centrafrican Republic
    "CG": ["fr"], // Republic of the Congo (Congo-Brazzaville)
    "CH": ["de", "fr", "it", "rm"], // Switzerland
    "CI": ["fr"], // Côte d'Ivoire
    "CK": ["en", "rar"], // Cook Islands	Cook Islands
    "CL": ["es"], // Chile
    "CM": ["fr", "en"], // Cameroon	Cameroun
    "CN": ["zh-hans"], //	China
    "CO":	["es"], // Colombia
    "CR": ["es"], // Costa Rica
    "CU":	["es"], // Cuba
    "CV": ["pt"], // Cabo Verde
    "CW":	["nl", "en"], // Curaçao
    "CX":	["en"], // Christmas Island
    "CY":	["el", "tr"], // Cyprus
    "CZ":	["cs"], // Czech Republic
    "DE": ["de"], // Germany
    "DJ": ["fr", "ar", "so", "aa"], // Djibouti
    "DK": ["da"], // Denmark
    "DM": ["en"], // Dominica
    "DO": ["es"], // Dominican Republic
    "DZ": ["ar"], // Algeria
    "EC": ["es"], // Ecuador
    "EE": ["et"], // Estonia
    "EG": ["ar"], // Egypt
    "EH": ["ar", "es", "fr"], // Western Sahara	
    "ER":	["ti", "ar", "en"], // Eritrea 
    "ES": ["es", "ca", "eu", "gl"], // Spain	
    "ET": ["am", "om"], // Ethiopia
    "FI":	["fi", "sv", "se"], // Finland
    "FJ":	["en"], // Fiji
    "FK":	["en"], // Falkland Islands
    "FM": ["en"], // Micronesia (Federated States of)
    "FO":	["fo", "da"], // Faroe Islands
    "FR": ["fr"], // France
    "GA": ["fr"], // Gabon
    "GB":	["en", "ga", "cy", "gd", "kw"], // United Kingdom 
    "GD": ["en"], // Grenada
    "GE": ["ka"], // Georgia
    "GF": ["fr"], // French Guiana
    "GG": ["en"], // Guernsey
    "GH": ["en"], // Ghana
    "GI": ["en"], // Gibraltar
    "GL": ["kl", "da"], // Greenland
    "GM": ["en"], // The Gambia	
    "GN": ["fr"], // Guinea
    "GP": ["fr"], // Guadeloupe
    "GQ": ["es", "fr", "pt"], // Equatorial Guinea
    "GR": ["el"], // Greece
    "GS": ["en"], // South Georgia and the South Sandwich Islands
    "GT": ["es"], // Guatemala
    "GU": ["en", "ch"], // Guam
    "GW": ["pt"], // Guinea Bissau
    "GY": ["en"], // Guyana
    "HK": ["zh-hant", "en"], // Hong Kong (SAR of China)
    "HM": ["en"], // Heard Island and McDonald Islands
    "HN": ["es"], // Honduras
    "HR": ["hr"], // Croatia
    "HT": ["fr", "ht"], // Haiti
    "HU": ["hu"], // Hungary
    "ID": ["id"], // Indonesia
    "IE": ["en", "ga"], //	Ireland
    "IL": ["he"], // Israel
    "IM": ["en"], // Isle of Man
    "IN": ["hi", "en"], // India
    "IO": ["en"], // British Indian Ocean Territory
    "IQ": ["ar", "ku"], // Iraq
    "IR": ["fa"], // Iran
    "IS": ["is"], // Iceland
    "IT": ["it", "de", "fr"], // Italy
    "JE": ["en"], // Jersey
    "JM": ["en"], // Jamaica
    "JO": ["ar"], // Jordan
    "JP": ["ja"], // Japan
    "KE": ["sw", "en"], // Kenya
    "KG": ["ky", "ru"], // Kyrgyzstan
    "KH": ["km"], // Cambodia
    "KI": ["en"], // Kiribati
    "KM": ["ar", "fr", "sw"], // Comores
    "KN": ["en"], // Saint Kitts and Nevis
    "KP": ["ko"], // North Korea
    "KR": ["ko", "en"], // South Korea
    "KW": ["ar"], // Kuweit
    "KY": ["en"], // Cayman Islands
    "KZ": ["kk", "ru"], // Kazakhstan
    "LA": ["lo"], // Laos
    "LB": ["ar", "fr"], // Lebanon
    "LC": ["en"], // Saint Lucia
    "LI": ["de"], // Liechtenstein
    "LK": ["si", "ta"], // Sri Lanka
    "LR": ["en"], // Liberia
    "LS": ["en", "st"], // Lesotho
    "LT": ["lt"], // Lithuania
    "LU": ["lb", "fr", "de"], // Luxembourg
    "LV": ["lv"], // Latvia
    "LY": ["ar"], //	Libya
    "MA": ["fr", "zgh", "ar"], //	Morocco
    "MC": ["fr"], // Monaco
    "MD": ["ro", "ru", "uk"], // Moldova
    "ME": ["srp", "sr", "hr", "bs", "sq"], // Montenegro
    "MF": ["fr"], // Saint Martin (French part)
    "MG": ["mg", "fr"], // Madagascar
    "MH": ["en", "mh"], // Marshall Islands
    "MK": ["mk"], // Macedonia (Former Yugoslav Republic of)
    "ML": ["fr"], // Mali
    "MM": ["my"], // Myanmar
    "MN": ["mn"], // Mongolia
    "MO": ["zh-hant", "pt"], // Macao (SAR of China)
    "MP": ["en", "ch"], // Northern Mariana Islands
    "MQ": ["fr"], // Martinique
    "MR": ["ar", "fr"], // Mauritania
    "MS": ["en"], // Montserrat
    "MT": ["mt", "en"], // Malta
    "MU": ["mfe", "fr", "en"], // Mauritius
    "MV": ["dv"], // Maldives
    "MW": ["en", "ny"], // Malawi
    "MX": ["es"], // Mexico
    "MY": ["ms"], // Malaysia
    "MZ": ["pt"], // Mozambique
    "NA": ["en", "sf", "de"], // Namibia
    "NC": ["fr"], // New Caledonia
    "NE": ["fr"], // Niger
    "NF": ["en", "pih"], // Norfolk Island
    "NG": ["en"], // Nigeria
    "NI": ["es"], // Nicaragua
    "NL": ["nl"], // The Netherlands
    "NO": ["nb", "nn", "no", "se"], // Norway
    "NP": ["ne"], // Nepal
    "NR": ["na", "en"], // Nauru
    "NU": ["niu", "en"], // Niue
    "NZ": ["mi", "en"], // New Zealand
    "OM": ["ar"], // Oman
    "PA": ["es"], // Panama
    "PE": ["es"], // Peru
    "PF": ["fr"], // French Polynesia
    "PG": ["en", "tpi", "ho"], // Papua New Guinea
    "PH": ["en", "tl"], // Philippines
    "PK": ["en", "ur"], // Pakistan
    "PL": ["pl"], // Poland
    "PM": ["fr"], // Saint Pierre and Miquelon
    "PN": ["en", "pih"], // Pitcairn
    "PR": ["es", "en"], // Puerto Rico
    "PS": ["ar", "he"], // Palestinian Territory
    "PT": ["pt"], // Portugal
    "PW": ["en", "pau", "ja", "sov", "tox"], // Palau
    "PY": ["es", "gn"], // Paraguay
    "QA": ["ar"], // Qatar
    "RE": ["fr"], // Reunion
    "RO": ["ro"], // Romania
    "RS": ["sr", "sr-Latn"], // Serbia
    "RU": ["ru"], // Russia
    "RW": ["rw", "fr", "en"], // Rwanda
    "SA": ["ar"], // Saudi Arabia
    "SB": ["en"], // Solomon Islands
    "SC": ["fr", "en", "crs"], // Seychelles
    "SD": ["ar", "en"], // Sudan
    "SE": ["sv"], // Sweden
    "SG": ["zh-hans", "en", "ms", "ta"], // Singapore
    "SH": ["en"], // Saint Helena
    "SI": ["sl"], // Slovenia
    "SJ": ["no"], // Svalbard and Jan Mayen
    "SK": ["sk"], // Slovakia
    "SL": ["en"], // Sierra Leone
    "SM": ["it"], // San Marino	
    "SN": ["fr"], // Sénégal
    "SO": ["so", "ar"], // Somalia
    "SR": ["nl"], // Suriname
    "ST": ["pt"], // São Tomé and Príncipe
    "SS": ["en"], // South Sudan
    "SV": ["es"], // El Salvador
    "SX": ["nl", "en"], // Saint Martin (Dutch part)
    "SY": ["ar"], // Syria
    "SZ": ["en", "ss"], // Swaziland
    "TC": ["en"], // Turks and Caicos Islands
    "TD": ["fr", "ar"], // Chad
    "TF": ["fr"], // French Southern and Antarctic Lands
    "TG": ["fr"], // Togo
    "TH": ["th"], // Thailand
    "TJ": ["tg", "ru"], // Tajikistan
    "TK": ["tkl", "en", "sm"], // Tokelau
    "TL": ["pt", "tet"], // Timor-Leste
    "TM": ["tk"], // Turkmenistan
    "TN": ["ar", "fr"], // Tunisia
    "TO": ["en"], // Tonga
    "TR": ["tr"], // Turkey
    "TT": ["en"], // Trinidad and Tobago
    "TV": ["en"], // Tuvalu
    "TW": ["zh-hant"], // Taiwan
    "TZ": ["sw", "en"], // Tanzania
    "UA": ["uk", "ru"], // Ukraine
    "UG": ["en", "sw"], // Uganda	Uganda	
    "UM": ["en"], // United States Minor Outlying Islands
    "US": ["en"], // United States of America
    "UY": ["es"], // Uruguay
    "UZ": ["uz", "kaa"], // Uzbekistan
    "VA": ["it"], // City of the Vatican
    "VC": ["en"], // Saint Vincent and the Grenadines
    "VE": ["es"], // Venezuela
    "VG": ["en"], // British Virgin Islands
    "VI": ["en"], // United States Virgin Islands
    "VN": ["vi"], // Vietnam
    "VU": ["bi", "en", "fr"], // Vanuatu
    "WF": ["fr"], // Wallis and Futuna
    "WS": ["sm", "en"], // Samoa	Samoa	
    "YE": ["ar"], // Yemen
    "YT": ["fr"], // Mayotte
    "ZA": ["en", "af", "st", "tn", "xh", "zu"], // South Africa	
    "ZM": ["en"], // Zambia
    "ZW": ["en", "sn", "nd"], // Zimbabwe	
  })
});
