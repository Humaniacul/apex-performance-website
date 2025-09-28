'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  region: z.string().min(1, 'Please select your region'),
  inquiryType: z.string().min(1, 'Please select an inquiry type'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0, 'Bot detected'), // Honeypot field
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Custom className */
  className?: string;
  /** Success callback */
  onSuccess?: (data: ContactFormData) => void;
  /** Error callback */
  onError?: (error: string) => void;
}

const regions = [
  { value: '', label: 'Select Region' },
  { value: 'north-america', label: 'North America' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia-pacific', label: 'Asia Pacific' },
  { value: 'middle-east', label: 'Middle East' },
  { value: 'other', label: 'Other' },
];

const inquiryTypes = [
  { value: '', label: 'Select Inquiry Type' },
  { value: 'purchase', label: 'Purchase Inquiry' },
  { value: 'test-drive', label: 'Test Drive Request' },
  { value: 'customization', label: 'Customization Options' },
  { value: 'technical', label: 'Technical Specifications' },
  { value: 'service', label: 'Service & Support' },
  { value: 'media', label: 'Media & Press' },
  { value: 'partnership', label: 'Business Partnership' },
  { value: 'other', label: 'Other' },
];

/**
 * Contact Form Component
 * Features: Form validation, multiple integration options (Netlify, Supabase), 
 * honeypot protection, success/error states
 */
export default function ContactForm({
  title = 'Contact Our Specialists',
  description = 'Ready to experience automotive excellence? Our team is here to assist with your Apex journey.',
  className = '',
  onSuccess,
  onError,
}: ContactFormProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  // Netlify Forms submission
  const submitToNetlify = async (data: ContactFormData): Promise<void> => {
    const formData = new FormData();
    
    // Add form data
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'honeypot') { // Don't submit honeypot field
        formData.append(key, value as string);
      }
    });
    
    formData.append('form-name', 'apex-contact');

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any).toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to submit form');
    }
  };

  // Supabase submission (serverless function)
  const submitToSupabase = async (data: ContactFormData): Promise<void> => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        source: 'contact-form',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit form');
    }
  };

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    // Check honeypot
    if (data.honeypot) {
      setSubmitStatus('error');
      setErrorMessage('Bot submission detected');
      return;
    }

    setSubmitStatus('submitting');
    setErrorMessage('');

    try {
      // Try Supabase first, fallback to Netlify
      try {
        await submitToSupabase(data);
      } catch (supabaseError) {
        console.warn('Supabase submission failed, trying Netlify:', supabaseError);
        await submitToNetlify(data);
      }

      setSubmitStatus('success');
      onSuccess?.(data);
      reset();

      // Auto-reset success state after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setErrorMessage(message);
      onError?.(message);
    }
  };

  return (
    <section className={`section-padding ${className}`}>
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
                {title}
              </h2>
              <p className="text-xl text-apex-muted">
                {description}
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-apex-red/20 rounded-xl flex items-center justify-center">
                  <Phone size={20} className="text-apex-red" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Phone</h3>
                  <p className="text-apex-muted">+1 (555) APEX-001</p>
                  <p className="text-sm text-apex-muted">Available 24/7</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-apex-red/20 rounded-xl flex items-center justify-center">
                  <Mail size={20} className="text-apex-red" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <p className="text-apex-muted">contact@apex-performance.com</p>
                  <p className="text-sm text-apex-muted">Response within 2 hours</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-apex-red/20 rounded-xl flex items-center justify-center">
                  <MapPin size={20} className="text-apex-red" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Headquarters</h3>
                  <p className="text-apex-muted">1 Performance Drive</p>
                  <p className="text-apex-muted">Los Angeles, CA 90210</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-apex-grey/50 rounded-xl p-6 border border-gray-800">
              <h3 className="font-semibold text-white mb-3">What to Expect</h3>
              <div className="space-y-2 text-sm text-apex-muted">
                <p>• Personal consultation with our specialists</p>
                <p>• Detailed vehicle specifications and pricing</p>
                <p>• Customization options tailored to you</p>
                <p>• Exclusive invitation to private viewing</p>
                <p>• Full financing and delivery support</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-apex-grey/30 rounded-2xl p-8 border border-gray-800"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Netlify form detection */}
            <form
              name="apex-contact"
              hidden
              data-netlify="true"
              data-netlify-honeypot="bot-field"
            >
              <input type="text" name="name" />
              <input type="email" name="email" />
              <input type="tel" name="phone" />
              <select name="region">
                <option value="">Region</option>
              </select>
              <select name="inquiryType">
                <option value="">Inquiry</option>
              </select>
              <textarea name="message"></textarea>
            </form>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Honeypot field */}
              <input
                type="text"
                {...register('honeypot')}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className={`form-input ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`form-input ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                )}
              </div>

              {/* Region and Inquiry Type */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="region" className="form-label">
                    Region *
                  </label>
                  <select
                    id="region"
                    {...register('region')}
                    className={`form-input ${errors.region ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  >
                    {regions.map((region) => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                  {errors.region && (
                    <p className="mt-1 text-sm text-red-400">{errors.region.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="inquiryType" className="form-label">
                    Inquiry Type *
                  </label>
                  <select
                    id="inquiryType"
                    {...register('inquiryType')}
                    className={`form-input ${errors.inquiryType ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.inquiryType && (
                    <p className="mt-1 text-sm text-red-400">{errors.inquiryType.message}</p>
                  )}
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="form-label">
                  Message *
                </label>
                <textarea
                  id="message"
                  {...register('message')}
                  className={`form-textarea ${errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Tell us about your interest in Apex Performance..."
                  rows={5}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className={`w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center space-x-2 ${
                  submitStatus === 'success' ? 'bg-green-600 hover:bg-green-600' : ''
                }`}
                whileHover={{ scale: submitStatus !== 'success' ? 1.02 : 1 }}
                whileTap={{ scale: submitStatus !== 'success' ? 0.98 : 1 }}
              >
                {submitStatus === 'submitting' && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {submitStatus === 'success' && <CheckCircle size={20} />}
                {submitStatus === 'error' && <AlertCircle size={20} />}
                {submitStatus === 'idle' && <Send size={20} />}
                
                <span>
                  {submitStatus === 'submitting' && 'Sending Message...'}
                  {submitStatus === 'success' && 'Message Sent!'}
                  {submitStatus === 'error' && 'Try Again'}
                  {submitStatus === 'idle' && 'Send Message'}
                </span>
              </motion.button>

              {/* Error Message */}
              {submitStatus === 'error' && errorMessage && (
                <motion.div
                  className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                  </div>
                </motion.div>
              )}

              {/* Success Message */}
              {submitStatus === 'success' && (
                <motion.div
                  className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-green-400 text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} />
                    <span>Thank you! We'll be in touch within 2 hours.</span>
                  </div>
                </motion.div>
              )}

              {/* Privacy Notice */}
              <p className="text-xs text-apex-muted text-center">
                Your information is secure and will only be used to respond to your inquiry. 
                We respect your privacy and will never share your details with third parties.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
