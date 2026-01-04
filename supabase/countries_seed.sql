-- Seed data for countries
-- This file contains country-specific information for landing pages

INSERT INTO public.countries (
  name, slug, flag, description, network_operators, coverage_areas, seo_title, seo_description, seo_keywords
) VALUES
(
  'Japan',
  'japan',
  '🇯🇵',
  'Stay connected in Japan with our reliable eSIM data plans. Perfect for tourists, business travelers, and digital nomads exploring the Land of the Rising Sun.',
  ARRAY['NTT Docomo', 'SoftBank', 'KDDI (au)'],
  ARRAY['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Okinawa', 'All major cities'],
  'Japan eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for Japan. Works with NTT Docomo, SoftBank, and KDDI. No roaming fees, instant activation. Perfect for Tokyo, Osaka, and all of Japan.',
  'japan esim, japan data plan, japan travel sim, esim japan, japan internet'
),
(
  'United States',
  'united-states',
  '🇺🇸',
  'Get connected across all 50 states with our comprehensive US eSIM plans. Works with major carriers including AT&T, T-Mobile, and Verizon.',
  ARRAY['AT&T', 'T-Mobile', 'Verizon'],
  ARRAY['All 50 states', 'Major cities', 'Highways', 'Rural areas'],
  'USA eSIM Plans | United States Data | AloTelcom',
  'Buy eSIM data plans for the United States. Works with AT&T, T-Mobile, and Verizon. Coverage across all 50 states. No roaming fees.',
  'usa esim, united states esim, us data plan, america esim, usa travel sim'
),
(
  'Turkey',
  'turkey',
  '🇹🇷',
  'Explore Turkey with reliable connectivity. Our eSIM plans work across Istanbul, Cappadocia, and all major tourist destinations.',
  ARRAY['Turkcell', 'Vodafone TR', 'Türk Telekom'],
  ARRAY['Istanbul', 'Ankara', 'Izmir', 'Cappadocia', 'Antalya'],
  'Turkey eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for Turkey. Works with Turkcell, Vodafone TR, and Türk Telekom. Perfect for Istanbul, Cappadocia, and all of Turkey.',
  'turkey esim, turkey data plan, turkey travel sim, esim turkey, istanbul esim'
),
(
  'United Kingdom',
  'united-kingdom',
  '🇬🇧',
  'Stay connected across England, Scotland, Wales, and Northern Ireland with our UK eSIM plans. Works with all major UK carriers.',
  ARRAY['EE', 'Vodafone UK', 'O2', 'Three'],
  ARRAY['London', 'Edinburgh', 'Manchester', 'Birmingham', 'All of UK'],
  'UK eSIM Plans | United Kingdom Data | AloTelcom',
  'Buy eSIM data plans for the United Kingdom. Works with EE, Vodafone, O2, and Three. Coverage across England, Scotland, Wales, and Northern Ireland.',
  'uk esim, united kingdom esim, uk data plan, britain esim, uk travel sim'
),
(
  'Thailand',
  'thailand',
  '🇹🇭',
  'Experience Thailand with seamless connectivity. Our eSIM plans cover Bangkok, Phuket, and all major tourist destinations.',
  ARRAY['AIS', 'TrueMove H', 'dtac'],
  ARRAY['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'All major cities'],
  'Thailand eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for Thailand. Works with AIS, TrueMove H, and dtac. Perfect for Bangkok, Phuket, and all of Thailand.',
  'thailand esim, thailand data plan, thailand travel sim, esim thailand, bangkok esim'
),
(
  'France',
  'france',
  '🇫🇷',
  'Explore France with reliable connectivity. Our eSIM plans work across Paris, the French Riviera, and all of France.',
  ARRAY['Orange', 'SFR', 'Bouygues Telecom', 'Free Mobile'],
  ARRAY['Paris', 'Lyon', 'Marseille', 'Nice', 'All of France'],
  'France eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for France. Works with Orange, SFR, Bouygues, and Free. Coverage across all of France including Paris and the French Riviera.',
  'france esim, france data plan, france travel sim, esim france, paris esim'
),
(
  'Germany',
  'germany',
  '🇩🇪',
  'Stay connected across Germany with our comprehensive eSIM plans. Works with all major German carriers.',
  ARRAY['Telekom', 'Vodafone DE', 'O2 DE'],
  ARRAY['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'All of Germany'],
  'Germany eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for Germany. Works with Telekom, Vodafone, and O2. Coverage across all of Germany including Berlin, Munich, and Hamburg.',
  'germany esim, germany data plan, germany travel sim, esim germany, berlin esim'
),
(
  'Spain',
  'spain',
  '🇪🇸',
  'Experience Spain with seamless connectivity. Our eSIM plans cover Madrid, Barcelona, and all of Spain.',
  ARRAY['Movistar', 'Vodafone ES', 'Orange ES'],
  ARRAY['Madrid', 'Barcelona', 'Valencia', 'Seville', 'All of Spain'],
  'Spain eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for Spain. Works with Movistar, Vodafone, and Orange. Coverage across all of Spain including Madrid and Barcelona.',
  'spain esim, spain data plan, spain travel sim, esim spain, madrid esim'
),
(
  'Italy',
  'italy',
  '🇮🇹',
  'Explore Italy with reliable connectivity. Our eSIM plans work across Rome, Milan, Venice, and all of Italy.',
  ARRAY['TIM', 'Vodafone IT', 'Wind Tre', 'Iliad'],
  ARRAY['Rome', 'Milan', 'Venice', 'Florence', 'All of Italy'],
  'Italy eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for Italy. Works with TIM, Vodafone, Wind Tre, and Iliad. Coverage across all of Italy including Rome, Milan, and Venice.',
  'italy esim, italy data plan, italy travel sim, esim italy, rome esim'
),
(
  'Canada',
  'canada',
  '🇨🇦',
  'Stay connected across Canada with our comprehensive eSIM plans. Works with all major Canadian carriers.',
  ARRAY['Rogers', 'Bell', 'Telus', 'Freedom Mobile'],
  ARRAY['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'All of Canada'],
  'Canada eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for Canada. Works with Rogers, Bell, Telus, and Freedom Mobile. Coverage across all of Canada including Toronto, Vancouver, and Montreal.',
  'canada esim, canada data plan, canada travel sim, esim canada, toronto esim'
),
(
  'Australia',
  'australia',
  '🇦🇺',
  'Experience Australia with seamless connectivity. Our eSIM plans cover Sydney, Melbourne, and all of Australia.',
  ARRAY['Telstra', 'Optus', 'Vodafone AU'],
  ARRAY['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'All of Australia'],
  'Australia eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for Australia. Works with Telstra, Optus, and Vodafone. Coverage across all of Australia including Sydney and Melbourne.',
  'australia esim, australia data plan, australia travel sim, esim australia, sydney esim'
),
(
  'South Korea',
  'south-korea',
  '🇰🇷',
  'Stay connected in South Korea with our reliable eSIM plans. Perfect for Seoul, Busan, and all of South Korea.',
  ARRAY['SK Telecom', 'KT', 'LG U+'],
  ARRAY['Seoul', 'Busan', 'Incheon', 'Daegu', 'All of South Korea'],
  'South Korea eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for South Korea. Works with SK Telecom, KT, and LG U+. Coverage across all of South Korea including Seoul and Busan.',
  'south korea esim, korea esim, korea data plan, esim korea, seoul esim'
),
(
  'Singapore',
  'singapore',
  '🇸🇬',
  'Get connected in Singapore with our comprehensive eSIM plans. Works with all major Singapore carriers.',
  ARRAY['Singtel', 'StarHub', 'M1'],
  ARRAY['Singapore City', 'All of Singapore'],
  'Singapore eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for Singapore. Works with Singtel, StarHub, and M1. Full coverage across Singapore.',
  'singapore esim, singapore data plan, singapore travel sim, esim singapore'
),
(
  'UAE',
  'uae',
  '🇦🇪',
  'Experience the UAE with seamless connectivity. Our eSIM plans cover Dubai, Abu Dhabi, and all of the UAE.',
  ARRAY['Etisalat', 'du'],
  ARRAY['Dubai', 'Abu Dhabi', 'Sharjah', 'All of UAE'],
  'UAE eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for the UAE. Works with Etisalat and du. Coverage across Dubai, Abu Dhabi, and all of the UAE.',
  'uae esim, dubai esim, uae data plan, esim uae, dubai travel sim'
),
(
  'India',
  'india',
  '🇮🇳',
  'Stay connected across India with our comprehensive eSIM plans. Works with all major Indian carriers.',
  ARRAY['Jio', 'Airtel', 'Vodafone Idea'],
  ARRAY['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'All of India'],
  'India eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for India. Works with Jio, Airtel, and Vodafone Idea. Coverage across all of India including Mumbai, Delhi, and Bangalore.',
  'india esim, india data plan, india travel sim, esim india, mumbai esim'
),
(
  'Brazil',
  'brazil',
  '🇧🇷',
  'Explore Brazil with reliable connectivity. Our eSIM plans work across São Paulo, Rio de Janeiro, and all of Brazil.',
  ARRAY['Vivo', 'Claro', 'TIM Brasil', 'Oi'],
  ARRAY['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'All of Brazil'],
  'Brazil eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for Brazil. Works with Vivo, Claro, TIM, and Oi. Coverage across all of Brazil including São Paulo and Rio de Janeiro.',
  'brazil esim, brazil data plan, brazil travel sim, esim brazil, sao paulo esim'
),
(
  'Mexico',
  'mexico',
  '🇲🇽',
  'Experience Mexico with seamless connectivity. Our eSIM plans cover Mexico City, Cancún, and all of Mexico.',
  ARRAY['Telcel', 'Movistar MX', 'AT&T MX'],
  ARRAY['Mexico City', 'Cancún', 'Guadalajara', 'Monterrey', 'All of Mexico'],
  'Mexico eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for Mexico. Works with Telcel, Movistar, and AT&T. Coverage across all of Mexico including Mexico City and Cancún.',
  'mexico esim, mexico data plan, mexico travel sim, esim mexico, cancun esim'
),
(
  'Argentina',
  'argentina',
  '🇦🇷',
  'Stay connected in Argentina with our reliable eSIM plans. Perfect for Buenos Aires and all of Argentina.',
  ARRAY['Movistar AR', 'Claro AR', 'Personal'],
  ARRAY['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'All of Argentina'],
  'Argentina eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for Argentina. Works with Movistar, Claro, and Personal. Coverage across all of Argentina including Buenos Aires.',
  'argentina esim, argentina data plan, argentina travel sim, esim argentina, buenos aires esim'
),
(
  'South Africa',
  'south-africa',
  '🇿🇦',
  'Get connected in South Africa with our comprehensive eSIM plans. Works with all major South African carriers.',
  ARRAY['Vodacom', 'MTN', 'Cell C', 'Telkom'],
  ARRAY['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'All of South Africa'],
  'South Africa eSIM Plans | Instant Activation | AloTelcom',
  'Buy eSIM data plans for South Africa. Works with Vodacom, MTN, Cell C, and Telkom. Coverage across all of South Africa including Cape Town and Johannesburg.',
  'south africa esim, south africa data plan, south africa travel sim, esim south africa, cape town esim'
),
(
  'Europe',
  'europe',
  '🇪🇺',
  'Stay connected across Europe with our regional eSIM plan. Works in 30+ European countries with one plan.',
  ARRAY['Multiple carriers across Europe'],
  ARRAY['All EU countries', 'UK', 'Switzerland', 'Norway', '30+ countries'],
  'Europe eSIM Plans | Multi-Country | AloTelcom',
  'Buy eSIM data plans for Europe. One plan works across 30+ European countries. No roaming fees, instant activation. Perfect for multi-country travel.',
  'europe esim, europe data plan, europe travel sim, esim europe, eu esim'
)
ON CONFLICT (slug) DO NOTHING;

