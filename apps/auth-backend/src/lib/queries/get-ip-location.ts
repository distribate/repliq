import { logger } from '@repo/lib/utils/logger';
import ky from 'ky';

/**
 * Represents a collection of names for a geographical entity in various languages.
 * The key is the language code (e.g., "en", "ru", "de") and the value is the name.
 */
export interface LocalizedNames {
  [key: string]: string;
}

/**
 * Represents city-specific information.
 */
export interface City {
  geoname_id: number;
  names: LocalizedNames;
}

/**
 * Represents continent-specific information.
 */
export interface Continent {
  code: string;
  geoname_id: number;
  names: LocalizedNames;
}

/**
 * Represents country-specific information.
 */
export interface Country {
  geoname_id: number;
  is_in_european_union: boolean;
  iso_code: string;
  names: LocalizedNames;
}

/**
 * Represents geographical location details.
 */
export interface Location {
  latitude: number;
  longitude: number;
  time_zone: string;
  weather_code: string;
}

/**
 * Represents a subdivision, such as a state, province, or oblast.
 * The iso_code is optional as not all subdivisions may have one.
 */
export interface Subdivision {
  geoname_id: number;
  iso_code?: string;
  names: LocalizedNames;
}

/**
 * Represents connection and user traits.
 */
export interface Traits {
  autonomous_system_number: number;
  autonomous_system_organization: string;
  connection_type: string;
  isp: string;
  organization: string;
  user_type: string; // Consider using a string literal type like 'business' | 'residential' if values are known
}

/**
 * The main interface for the entire GeoIP data payload.
 */
export interface GeoDataPayload {
  city: City;
  continent: Continent;
  country: Country;
  location: Location;
  subdivisions: Subdivision[];
  traits: Traits;
}

const token = "0f89845eb2264b24aea27f7d48399130"

export async function getIpLocation(ip: string) {
  let location: GeoDataPayload | null = null;

  try {
    const res = await ky(`https://api.findip.net/${ip}/`, {
      throwHttpErrors: false,
      searchParams: {
        token
      }
    });

    console.log(res)
    const data = await res.json<GeoDataPayload>()
    console.log(data)

    if (data) {
      location = data;
    }
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message)
    }
  }

  return location
}