'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { safePost } from '../../lib/fetchers';
import { config } from '../../lib/config';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    industry: 'retail',
    country: '',
    city: '',
    zipCode: '',
    workingHours: {
      start: '09:00',
      end: '17:00'
    }
  });
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Business name is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      // Generate mock business ID
      const businessId = `business-${Date.now()}`;
      
      const businessData = {
        businessId,
        ...formData,
        ...(logoFile && { logo: `uploads/${logoFile.name}` }),
        createdAt: new Date().toISOString()
      };

      // Try API or use fallback
      const result = await safePost(
        `${config.coreApi}/signup`,
        businessData,
        businessData
      );
      
      // Store in localStorage
      localStorage.setItem('businessId', businessId);
      localStorage.setItem('businessData', JSON.stringify(businessData));
      
      setSuccess(true);
      
      // Redirect after success animation
      setTimeout(() => {
        router.push('/campaign/new');
      }, 2000);
      
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-slide-up">
          <div className="text-6xl mb-4 animate-bounce">✨</div>
          <h1 className="text-3xl font-bold gradient-text mb-4">Success!</h1>
          <p className="text-white/80 text-lg">Your business profile has been created</p>
          <div className="mt-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className={`w-full max-w-2xl transition-all duration-600 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              🏢 Business Registration
            </span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-pink-500 mx-auto rounded-full mb-4"></div>
          <p className="text-white/80 text-lg">
            Let's set up your business profile to get personalized marketing strategies
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Business Name"
              emoji="🏢"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter your business name"
              required
            />

            {/* Logo Upload with Preview */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <span className="mr-2 text-lg">🎨</span>
                Logo (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-white/30 bg-white/90 backdrop-blur-sm transition-all duration-300 focus:border-primary-500 focus:shadow-glow"
                />
                {logoPreview && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/30">
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span className="mr-2 text-lg">🏢</span>
                Industry
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-white/30 bg-white/90 backdrop-blur-sm transition-all duration-300 focus:border-primary-500 focus:shadow-glow"
                required
              >
                <option value="retail">🛍️ Retail</option>
                <option value="restaurant">🍽️ Restaurant</option>
                <option value="bakery">🥖 Bakery</option>
                <option value="salon">💄 Salon/Beauty</option>
                <option value="services">💼 Professional Services</option>
                <option value="healthcare">🏥 Healthcare</option>
                <option value="technology">💻 Technology</option>
                <option value="other">🏢 Other</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Country"
                emoji="🌍"
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={errors.country}
                placeholder="e.g., United States"
                required
              />
              <Input
                label="City"
                emoji="🏙️"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                placeholder="e.g., New York"
                required
              />
            </div>

            <Input
              label="ZIP Code"
              emoji="📮"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              error={errors.zipCode}
              placeholder="e.g., 10001"
              required
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <span className="mr-2 text-lg">🌅</span>
                  Opening Time
                </label>
                <input
                  type="time"
                  name="workingHours.start"
                  value={formData.workingHours.start}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-white/30 bg-white/90 backdrop-blur-sm transition-all duration-300 focus:border-primary-500 focus:shadow-glow"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <span className="mr-2 text-lg">🌆</span>
                  Closing Time
                </label>
                <input
                  type="time"
                  name="workingHours.end"
                  value={formData.workingHours.end}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-white/30 bg-white/90 backdrop-blur-sm transition-all duration-300 focus:border-primary-500 focus:shadow-glow"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              size="lg"
              glow
              shine
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Profile...
                </>
              ) : (
                '✨ Create Business Profile'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}