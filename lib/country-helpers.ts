import { supabase } from './supabase';
import type { Database } from './database.types';

type DbCountry = Database['public']['Tables']['countries']['Row'];

export interface CountryInfo {
  id: string;
  name: string;
  slug: string;
  flag: string;
  description: string;
  networkOperators: string[];
  coverage: string[];
  popularPlans?: Array<{
    id: string;
    name: string;
    data: string;
    validity: string;
    price: number;
  }>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

// Fetch all countries
export const fetchCountries = async (): Promise<CountryInfo[]> => {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching countries:', error);
    return [];
  }

  return (data || []).map((country: DbCountry) => ({
    id: country.id,
    name: country.name,
    slug: country.slug,
    flag: country.flag,
    description: country.description,
    networkOperators: country.network_operators || [],
    coverage: country.coverage_areas || [],
    popularPlans: country.popular_plans ? JSON.parse(JSON.stringify(country.popular_plans)) : undefined,
    seoTitle: country.seo_title || undefined,
    seoDescription: country.seo_description || undefined,
    seoKeywords: country.seo_keywords || undefined,
  }));
};

// Fetch a single country by slug
export const fetchCountryBySlug = async (slug: string): Promise<CountryInfo | null> => {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching country:', error);
    return null;
  }

  if (!data) return null;

  const country: DbCountry = data;
  return {
    id: country.id,
    name: country.name,
    slug: country.slug,
    flag: country.flag,
    description: country.description,
    networkOperators: country.network_operators || [],
    coverage: country.coverage_areas || [],
    popularPlans: country.popular_plans ? JSON.parse(JSON.stringify(country.popular_plans)) : undefined,
    seoTitle: country.seo_title || undefined,
    seoDescription: country.seo_description || undefined,
    seoKeywords: country.seo_keywords || undefined,
  };
};

