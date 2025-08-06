import { logger } from '@repo/lib/utils/logger';
import ky from 'ky';

export interface LocalizedNames {
  [key: string]: string;
}

export interface City {
  geoname_id: number;
  names: LocalizedNames;
}

export interface Continent {
  code: string;
  geoname_id: number;
  names: LocalizedNames;
}
export interface Country {
  geoname_id: number;
  is_in_european_union: boolean;
  iso_code: string;
  names: LocalizedNames;
}

export interface Location {
  latitude: number;
  longitude: number;
  time_zone: string;
  weather_code: string;
}

export interface Subdivision {
  geoname_id: number;
  iso_code?: string;
  names: LocalizedNames;
}

export interface Traits {
  autonomous_system_number: number;
  autonomous_system_organization: string;
  connection_type: string;
  isp: string;
  organization: string;
  user_type: string;
}

export interface GeoDataPayload {
  city: City;
  continent: Continent;
  country: Country;
  location: Location;
  subdivisions: Subdivision[];
  traits: Traits;
}

export async function getIpLocation(ip: string) {
  let location: GeoDataPayload | null = null;

  try {
    const res = await ky(`https://api.findip.net/${ip}/`, {
      throwHttpErrors: false,
      searchParams: {
        token: Bun.env.LOCATION_TOKEN!
      },
      timeout: 2000
    });

    const data = await res.json<GeoDataPayload>()

    if (data) {
      location = data;
    }
  } catch (e) {
    e instanceof Error && logger.error(e.message)
  }

  return location
}