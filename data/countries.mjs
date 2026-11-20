// The countries with researched figures, and the preset each one starts from.
//
// A preset (us, westernEurope, buenosAires) supplies everything the country
// research does not: how long each kind of disruption lasts, the ordinary and
// regional hazards, the AI rates and the typical home. The country research
// (research/countries/) then replaces, for that country, the figures listed
// in COUNTRY_FIELDS. The preset is the closest of the three in income and
// region: the United States for the rich English-speaking countries of the
// Americas and Oceania, Western Europe for the rest of the rich world, and
// Buenos Aires for middle-income countries.
//
// A country not listed here has no figures of its own: the page uses the
// preset given by `presetFor` below, and says so.

export const COUNTRIES = [
  // OECD members
  ['AU', 'Australia', 'us'], ['AT', 'Austria', 'westernEurope'], ['BE', 'Belgium', 'westernEurope'],
  ['CA', 'Canada', 'us'], ['CL', 'Chile', 'buenosAires'], ['CO', 'Colombia', 'buenosAires'],
  ['CR', 'Costa Rica', 'buenosAires'], ['CZ', 'Czechia', 'westernEurope'], ['DK', 'Denmark', 'westernEurope'],
  ['EE', 'Estonia', 'westernEurope'], ['FI', 'Finland', 'westernEurope'], ['FR', 'France', 'westernEurope'],
  ['DE', 'Germany', 'westernEurope'], ['GR', 'Greece', 'westernEurope'], ['HU', 'Hungary', 'westernEurope'],
  ['IS', 'Iceland', 'westernEurope'], ['IE', 'Ireland', 'westernEurope'], ['IL', 'Israel', 'westernEurope'],
  ['IT', 'Italy', 'westernEurope'], ['JP', 'Japan', 'westernEurope'], ['KR', 'South Korea', 'westernEurope'],
  ['LV', 'Latvia', 'westernEurope'], ['LT', 'Lithuania', 'westernEurope'], ['LU', 'Luxembourg', 'westernEurope'],
  ['MX', 'Mexico', 'buenosAires'], ['NL', 'Netherlands', 'westernEurope'], ['NZ', 'New Zealand', 'us'],
  ['NO', 'Norway', 'westernEurope'], ['PL', 'Poland', 'westernEurope'], ['PT', 'Portugal', 'westernEurope'],
  ['SK', 'Slovakia', 'westernEurope'], ['SI', 'Slovenia', 'westernEurope'], ['ES', 'Spain', 'westernEurope'],
  ['SE', 'Sweden', 'westernEurope'], ['CH', 'Switzerland', 'westernEurope'], ['TR', 'Turkey', 'buenosAires'],
  ['GB', 'United Kingdom', 'westernEurope'], ['US', 'United States', 'us'],
  // Large middle-income countries
  ['AR', 'Argentina', 'buenosAires'], ['BR', 'Brazil', 'buenosAires'], ['CN', 'China', 'buenosAires'],
  ['IN', 'India', 'buenosAires'], ['ID', 'Indonesia', 'buenosAires'], ['NG', 'Nigeria', 'buenosAires'],
  ['PH', 'Philippines', 'buenosAires'], ['ZA', 'South Africa', 'buenosAires'],
].map(([iso2, name, preset]) => ({ iso2, name, preset }));

// The figures the country research supplies, by research family. Each is a
// {lo, mid, hi} quantity. See research/BRIEF-COUNTRIES.md for definitions.
export const COUNTRY_FIELDS = {
  grid: ['localOutage.probability', 'localOutage.durationFactor'],
  banking: ['bankingCrisis.forecast', 'bankingCrisis.pessimistic'],
  violence: ['violentCrime.scale', 'civilUnrest.forecast', 'civilUnrest.pessimistic'],
  fire: ['houseFire.scale', 'coIncident.scale'],
  prices: ['priceIndex', 'micromortValueUsd', 'timeValueUsdPerHour'],
  nuclear: ['nuclearNear.forecast', 'nuclearNear.pessimistic', 'nuclearFar.forecast', 'nuclearFar.pessimistic', 'nuclearNear.falloutScale'],
};

// Unlisted countries, by ISO 3166 code and GeoNames continent code.
const US_LIKE = new Set(['PR', 'GU', 'VI', 'AS', 'MP', 'BM']);
const RICH_ELSEWHERE = new Set(['SG', 'TW', 'HK', 'MO', 'AE', 'QA', 'KW', 'BH', 'BN', 'SA', 'OM', 'CY', 'MT', 'AD', 'MC', 'SM', 'LI']);
export function presetFor(iso2, continent) {
  const listed = COUNTRIES.find((c) => c.iso2 === iso2);
  if (listed) return listed.preset;
  if (US_LIKE.has(iso2)) return 'us';
  if (RICH_ELSEWHERE.has(iso2)) return 'westernEurope';
  if (continent === 'EU') return 'westernEurope';
  return 'buenosAires';
}
