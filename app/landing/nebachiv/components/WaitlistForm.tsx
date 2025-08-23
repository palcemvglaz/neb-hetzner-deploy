'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ctaTexts from '../assets/copy/cta-texts.json';

interface WaitlistFormProps {
  version: 'ukrainian' | 'hormozi';
  variant?: 'inline' | 'modal';
  onSuccess?: () => void;
}

export default function WaitlistForm({ version, variant = 'inline', onSuccess }: WaitlistFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: ''
  });

  const texts = ctaTexts.form_labels[version];
  const buttons = ctaTexts.cta_buttons[version];
  const microcopy = ctaTexts.microcopy[version];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'nebachiv_landing',
          version,
          metadata: {
            landingVersion: version,
            timestamp: new Date().toISOString()
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      // Signup successful - logging removed from client component

      setSuccess(true);
      if (onSuccess) onSuccess();

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', experience: '' });
        setSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : microcopy.error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`text-center p-8 rounded-lg ${
        version === 'hormozi' 
          ? 'bg-green-900 border-2 border-green-500' 
          : 'bg-gray-800'
      }`}>
        <div className="text-4xl mb-4">✅</div>
        <p className="text-xl font-bold text-white">{microcopy.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-white mb-2 block">
          {texts.name}
        </Label>
        <Input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-gray-800 border-gray-700 text-white"
          placeholder={version === 'hormozi' ? 'Твоє ім\'я' : 'Ваше ім\'я'}
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-white mb-2 block">
          {texts.email}
        </Label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-gray-800 border-gray-700 text-white"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-white mb-2 block">
          {texts.phone}
        </Label>
        <Input
          id="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="bg-gray-800 border-gray-700 text-white"
          placeholder="+380..."
        />
      </div>

      <div>
        <Label htmlFor="experience" className="text-white mb-2 block">
          {texts.experience}
        </Label>
        <select
          id="experience"
          required
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md"
        >
          <option value="">Оберіть...</option>
          <option value="none">Немає досвіду</option>
          <option value="0-1">До 1 року</option>
          <option value="1-3">1-3 роки</option>
          <option value="3-5">3-5 років</option>
          <option value="5+">Більше 5 років</option>
        </select>
      </div>

      {error && (
        <p className="text-nebachiv-orange text-sm">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className={`w-full py-4 text-lg font-bold ${
          version === 'hormozi'
            ? 'bg-nebachiv-orange hover:bg-nebachiv-orange/80 animate-pulse'
            : 'bg-nebachiv-blue hover:bg-nebachiv-blue/80'
        }`}
      >
        {loading ? microcopy.loading : texts.submit}
      </Button>

      <p className="text-gray-400 text-sm text-center">
        {texts.privacy}
      </p>
    </form>
  );
}