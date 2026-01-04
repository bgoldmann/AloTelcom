import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, HelpCircle, BookOpen, MessageCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { SEO } from '../lib/seo';
import { FAQSchemaScript } from '../lib/schema';

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: BookOpen },
    { id: 'installation', name: 'Installation Guides', icon: FileText },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: HelpCircle },
    { id: 'billing', name: 'Billing & Payments', icon: MessageCircle },
    { id: 'account', name: 'Account Management', icon: HelpCircle },
    { id: 'technical', name: 'Technical Support', icon: HelpCircle },
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'What is an eSIM?',
      answer: 'An eSIM (embedded SIM) is a digital SIM card that allows you to activate a cellular plan without needing a physical SIM card. It\'s built into your device and can be activated instantly with a QR code.',
    },
    {
      category: 'getting-started',
      question: 'Which devices support eSIM?',
      answer: 'Most modern smartphones support eSIM, including iPhone XS and later, Google Pixel 3 and later, Samsung Galaxy S20 and later, and many other devices. Check your device manufacturer\'s website for specific compatibility.',
    },
    {
      category: 'getting-started',
      question: 'How do I know if my phone supports eSIM?',
      answer: 'You can check your device settings for "Add Cellular Plan" or "Add eSIM" option. Most devices manufactured after 2018 support eSIM. Check our compatibility guide for a complete list.',
    },
    {
      category: 'installation',
      question: 'How do I install an eSIM on my iPhone?',
      answer: '1. Go to Settings > Cellular > Add Cellular Plan\n2. Scan the QR code we sent to your email\n3. Follow the on-screen instructions\n4. Label your eSIM (e.g., "Travel Data")\n5. Set it as your data plan or use it alongside your primary SIM',
    },
    {
      category: 'installation',
      question: 'How do I install an eSIM on my Android device?',
      answer: '1. Go to Settings > Network & Internet > Mobile network\n2. Tap "Add" or "Download a SIM instead"\n3. Scan the QR code we sent to your email\n4. Follow the on-screen instructions\n5. Enable the eSIM for data when traveling',
    },
    {
      category: 'troubleshooting',
      question: 'My eSIM is not activating. What should I do?',
      answer: 'First, ensure your device supports eSIM and has a stable internet connection. Try scanning the QR code again, or manually enter the activation code. If issues persist, contact our support team with your order number.',
    },
    {
      category: 'troubleshooting',
      question: 'I can\'t see the eSIM option on my device',
      answer: 'Make sure your device is updated to the latest OS version. Some carriers lock eSIM functionality - you may need to contact your carrier or use a different device. Check our device compatibility guide for more details.',
    },
    {
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure payment processor. We also support PayPal and Apple Pay in select regions.',
    },
    {
      category: 'billing',
      question: 'Can I get a refund?',
      answer: 'Yes, we offer refunds for unused eSIM plans within 30 days of purchase, provided the eSIM has not been activated. Contact our support team with your order number to request a refund.',
    },
    {
      category: 'account',
      question: 'How do I change my email address?',
      answer: 'Go to your Profile settings and click "Edit Profile". Update your email address and verify it through the confirmation email we\'ll send you.',
    },
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a password reset link via email. Follow the instructions to create a new password.',
    },
  ];

  const popularArticles = [
    { title: 'Complete Guide to Installing eSIM on iPhone', category: 'installation' },
    { title: 'How to Avoid Roaming Charges While Traveling', category: 'getting-started' },
    { title: 'eSIM vs Physical SIM: Which is Better?', category: 'getting-started' },
    { title: 'Troubleshooting eSIM Activation Issues', category: 'troubleshooting' },
    { title: 'Understanding Data Plans and Validity', category: 'getting-started' },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const faqSchemaData = {
    questions: faqs.map(faq => ({
      question: faq.question,
      answer: faq.answer,
    })),
  };

  return (
    <>
      <SEO
        title="Help Center - AloTelcom Support & FAQ"
        description="Find answers to common questions about eSIM installation, troubleshooting, billing, and account management. Get instant help with our comprehensive support center."
        keywords="esim help, esim support, esim installation guide, esim troubleshooting, travel connectivity help"
        type="website"
      />
      <FAQSchemaScript data={faqSchemaData} />
      
      <div className="min-h-screen bg-pars-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-pars-primary mb-4">
              How can we help you?
            </h1>
            <p className="text-lg text-pars-text">
              Search our knowledge base or browse categories below
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pars-gray w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs, or guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-pars-light bg-white focus:ring-2 focus:ring-pars-cta focus:border-transparent outline-none text-pars-text"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-pars-cta bg-pars-cta/10'
                      : 'border-pars-light bg-white hover:border-pars-cta/50'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${
                    isSelected ? 'text-pars-cta' : 'text-pars-gray'
                  }`} />
                  <p className={`text-sm font-medium ${
                    isSelected ? 'text-pars-cta' : 'text-pars-text'
                  }`}>
                    {category.name}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Popular Articles */}
          {!searchQuery && !selectedCategory && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-pars-primary mb-6">Popular Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularArticles.map((article, index) => (
                  <Link
                    key={index}
                    to="/help-center"
                    className="p-6 bg-white rounded-xl border border-pars-light hover:border-pars-cta hover:shadow-lg transition-all"
                  >
                    <h3 className="font-semibold text-pars-primary mb-2">{article.title}</h3>
                    <p className="text-sm text-pars-gray">
                      {categories.find(c => c.id === article.category)?.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          <div>
            <h2 className="text-2xl font-bold text-pars-primary mb-6">
              {selectedCategory 
                ? `${categories.find(c => c.id === selectedCategory)?.name} FAQs`
                : 'Frequently Asked Questions'
              }
            </h2>
            <div className="space-y-4">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => {
                  const isExpanded = expandedFAQ === index;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl border border-pars-light overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFAQ(isExpanded ? null : index)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-pars-bg transition-colors"
                      >
                        <span className="font-semibold text-pars-primary pr-4">
                          {faq.question}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-pars-gray flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-pars-gray flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-6 text-pars-text whitespace-pre-line">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-pars-light">
                  <HelpCircle className="w-12 h-12 text-pars-gray mx-auto mb-4" />
                  <p className="text-pars-text">No results found. Try a different search term.</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-12 p-8 bg-gradient-to-r from-pars-cta to-pars-accent rounded-2xl text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
            <p className="mb-6 opacity-90">
              Our support team is available 24/7 to assist you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@alotelcom.com"
                className="px-6 py-3 bg-white text-pars-cta rounded-lg font-semibold hover:bg-opacity-90 transition-all"
              >
                Email Support
              </a>
              <Link
                to="/support"
                className="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-all border border-white/30"
              >
                Contact Form
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpCenter;

