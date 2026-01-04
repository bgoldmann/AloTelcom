import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Wifi, Clock, DollarSign, Check, Star, Globe, ArrowRight } from 'lucide-react';
import { SEO } from '../lib/seo';
import { BreadcrumbSchemaScript, ProductSchemaScript } from '../lib/schema';
import { useApp } from '../store';
import LoadingSpinner from '../components/LoadingSpinner';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';
import { Plan } from '../types';

interface CountryInfo {
  name: string;
  slug: string;
  flag: string;
  description: string;
  networkOperators: string[];
  coverage: string[];
  popularPlans: Array<{
    id: string;
    name: string;
    data: string;
    validity: string;
    price: number;
  }>;
}

const CountryPage: React.FC = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const { addToCart } = useApp();
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  // Generate mock plans for this country (in production, fetch from Supabase)
  const generatePlansForCountry = (countryName: string, flag: string): Plan[] => {
    const plans: Plan[] = [];
    const dataOptions = ['1 GB', '3 GB', '5 GB', '10 GB', '20 GB'];
    const validityOptions = ['7 Days', '15 Days', '30 Days'];
    const prices = [4.50, 8.00, 12.00, 18.00, 28.00];
    
    dataOptions.forEach((data, idx) => {
      validityOptions.forEach((validity, vIdx) => {
        plans.push({
          id: `${countryName.toLowerCase().replace(/\s+/g, '-')}-${data.toLowerCase().replace(/\s+/g, '-')}-${validity.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'esim',
          country: countryName,
          region: 'Local',
          data,
          validity,
          price: prices[idx] + (vIdx * 2),
          flag,
          isPopular: idx === 2 && vIdx === 1,
        });
      });
    });
    return plans;
  };

  // Mock country data - In production, fetch from Supabase
  const countryData: Record<string, CountryInfo> = {
    japan: {
      name: 'Japan',
      slug: 'japan',
      flag: '🇯🇵',
      description: 'Stay connected in Japan with our reliable eSIM data plans. Perfect for tourists, business travelers, and digital nomads exploring the Land of the Rising Sun.',
      networkOperators: ['NTT Docomo', 'SoftBank', 'KDDI (au)'],
      coverage: ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Okinawa', 'All major cities'],
      popularPlans: [
        { id: 'jp-10gb', name: 'Japan 10GB', data: '10GB', validity: '30 days', price: 18 },
        { id: 'jp-5gb', name: 'Japan 5GB', data: '5GB', validity: '30 days', price: 12 },
        { id: 'jp-20gb', name: 'Japan 20GB', data: '20GB', validity: '30 days', price: 28 },
      ],
    },
    'united-states': {
      name: 'United States',
      slug: 'united-states',
      flag: '🇺🇸',
      description: 'Get connected across all 50 states with our comprehensive US eSIM plans. Works with major carriers including AT&T, T-Mobile, and Verizon.',
      networkOperators: ['AT&T', 'T-Mobile', 'Verizon'],
      coverage: ['All 50 states', 'Major cities', 'Highways', 'Rural areas'],
      popularPlans: [
        { id: 'us-10gb', name: 'USA 10GB', data: '10GB', validity: '30 days', price: 25 },
        { id: 'us-5gb', name: 'USA 5GB', data: '5GB', validity: '30 days', price: 15 },
        { id: 'us-unlimited', name: 'USA Unlimited', data: 'Unlimited', validity: '30 days', price: 45 },
      ],
    },
    turkey: {
      name: 'Turkey',
      slug: 'turkey',
      flag: '🇹🇷',
      description: 'Explore Turkey with reliable connectivity. Our eSIM plans work across Istanbul, Cappadocia, and all major tourist destinations.',
      networkOperators: ['Turkcell', 'Vodafone TR', 'Türk Telekom'],
      coverage: ['Istanbul', 'Ankara', 'Izmir', 'Cappadocia', 'Antalya'],
      popularPlans: [
        { id: 'tr-10gb', name: 'Turkey 10GB', data: '10GB', validity: '30 days', price: 12 },
        { id: 'tr-5gb', name: 'Turkey 5GB', data: '5GB', validity: '30 days', price: 8 },
      ],
    },
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const data = countryData[countrySlug || ''];
      if (data) {
        setCountryInfo(data);
      }
      setLoading(false);
    }, 500);
  }, [countrySlug]);

  // Generate plans for the current country
  const countryPlans = countryInfo ? generatePlansForCountry(countryInfo.name, countryInfo.flag) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-pars-bg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!countryInfo) {
    return (
      <div className="min-h-screen bg-pars-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pars-primary mb-4">Country Not Found</h1>
          <Link to="/marketplace" className="text-pars-cta hover:underline">
            Browse All Plans
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbData = {
    items: [
      { name: 'Home', url: 'https://alotelcom.com/' },
      { name: 'eSIM Plans', url: 'https://alotelcom.com/marketplace' },
      { name: countryInfo.name, url: `https://alotelcom.com/esim/${countryInfo.slug}` },
    ],
  };

  const handleAddToCart = (planId: string) => {
    const plan = countryPlans.find(p => p.id === planId);
    if (plan) {
      addToCart(plan);
      setSelectedPlan(planId);
      setTimeout(() => setSelectedPlan(null), 2000);
    }
  };

  return (
    <>
      <SEO
        title={`${countryInfo.name} eSIM Plans | Instant Activation | AloTelcom`}
        description={`Buy eSIM data plans for ${countryInfo.name}. ${countryInfo.description} No roaming fees, instant activation.`
        }
        keywords={`${countryInfo.name} esim, ${countryInfo.name} data plan, ${countryInfo.name} travel sim, esim ${countryInfo.name.toLowerCase()}`}
        type="website"
      />
      <BreadcrumbSchemaScript data={breadcrumbData} />

      <div className="min-h-screen bg-pars-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">{countryInfo.flag}</div>
            <h1 className="text-4xl md:text-5xl font-bold text-pars-primary mb-4">
              eSIM Plans for {countryInfo.name}
            </h1>
            <p className="text-lg text-pars-text max-w-3xl mx-auto">
              {countryInfo.description}
            </p>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-stone-800 rounded-xl border border-pars-light p-6">
              <Wifi className="w-8 h-8 text-pars-cta mb-3" />
              <h3 className="font-bold text-pars-primary mb-2">Instant Activation</h3>
              <p className="text-sm text-pars-text">Get connected in minutes with QR code activation</p>
            </div>
            <div className="bg-white dark:bg-stone-800 rounded-xl border border-pars-light p-6">
              <Globe className="w-8 h-8 text-pars-cta mb-3" />
              <h3 className="font-bold text-pars-primary mb-2">Wide Coverage</h3>
              <p className="text-sm text-pars-text">Works across {countryInfo.coverage.length} major areas</p>
            </div>
            <div className="bg-white dark:bg-stone-800 rounded-xl border border-pars-light p-6">
              <DollarSign className="w-8 h-8 text-pars-cta mb-3" />
              <h3 className="font-bold text-pars-primary mb-2">No Roaming Fees</h3>
              <p className="text-sm text-pars-text">Save money compared to your home carrier</p>
            </div>
          </div>

          {/* Network Operators */}
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-pars-light p-6 mb-12">
            <h2 className="text-xl font-bold text-pars-primary mb-4">Network Operators</h2>
            <div className="flex flex-wrap gap-3">
              {countryInfo.networkOperators.map((operator) => (
                <span
                  key={operator}
                  className="px-4 py-2 bg-pars-bg text-pars-text rounded-lg text-sm font-medium"
                >
                  {operator}
                </span>
              ))}
            </div>
          </div>

          {/* Coverage Areas */}
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-pars-light p-6 mb-12">
            <h2 className="text-xl font-bold text-pars-primary mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pars-cta" />
              Coverage Areas
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {countryInfo.coverage.map((area) => (
                <div key={area} className="flex items-center gap-2 text-pars-text">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Available Plans */}
          <div>
            <h2 className="text-2xl font-bold text-pars-primary mb-6">Available Plans</h2>
            {countryPlans.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {countryPlans.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      className="bg-white dark:bg-stone-800 rounded-xl border border-pars-light hover:border-pars-cta hover:shadow-lg transition-all overflow-hidden"
                    >
                      {plan.isPopular && (
                        <div className="bg-pars-cta text-white text-center py-2 text-sm font-semibold">
                          Most Popular
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-3xl">{plan.flag}</div>
                          {plan.isPopular && (
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm font-medium">4.8</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-pars-primary mb-2">{plan.name}</h3>
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-pars-text">
                            <Wifi className="w-4 h-4 text-pars-cta" />
                            <span>{plan.data} data</span>
                          </div>
                          <div className="flex items-center gap-2 text-pars-text">
                            <Clock className="w-4 h-4 text-pars-cta" />
                            <span>Valid for {plan.validity}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <span className="text-3xl font-bold text-pars-primary">${plan.price}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddToCart(plan.id)}
                          disabled={isSelected}
                          className={`w-full py-3 rounded-lg font-semibold transition-all ${
                            isSelected
                              ? 'bg-green-500 text-white'
                              : 'bg-pars-cta text-white hover:bg-orange-700'
                          }`}
                        >
                          {isSelected ? (
                            <span className="flex items-center justify-center gap-2">
                              <Check className="w-5 h-5" />
                              Added to Cart
                            </span>
                          ) : (
                            'Add to Cart'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {countryInfo.popularPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white dark:bg-stone-800 rounded-xl border border-pars-light p-6"
                  >
                    <h3 className="text-xl font-bold text-pars-primary mb-4">{plan.name}</h3>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-pars-text">
                        <Wifi className="w-4 h-4 text-pars-cta" />
                        <span>{plan.data}</span>
                      </div>
                      <div className="flex items-center gap-2 text-pars-text">
                        <Clock className="w-4 h-4 text-pars-cta" />
                        <span>{plan.validity}</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-pars-primary mb-6">${plan.price}</div>
                    <Link
                      to="/marketplace"
                      className="block w-full py-3 bg-pars-cta text-white text-center rounded-lg font-semibold hover:bg-orange-700 transition-all"
                    >
                      View Plan
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Installation Guide CTA */}
          <div className="mt-12 bg-gradient-to-r from-pars-cta to-amber-500 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help Installing Your eSIM?</h2>
            <p className="mb-6 opacity-90">
              Check out our step-by-step installation guides for iPhone and Android
            </p>
            <Link
              to="/help"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pars-cta rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              View Installation Guide
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CountryPage;

