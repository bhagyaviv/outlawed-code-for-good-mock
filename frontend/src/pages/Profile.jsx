import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { User, Shield, CheckCircle2 } from 'lucide-react';

/**
 * Reusable Profile View Component
 * @param {Object} props
 * @param {Object} props.user - current logged-in user profile
 * @param {function} props.onUserUpdate - callback to bubble up profile changes to global state
 */
export default function Profile({ user = { name: '[USER NAME]', email: 'demo@example.com' }, onUserUpdate }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({});

    // Simple validation
    if (!name.trim()) {
      setErrors({ name: 'Name cannot be blank' });
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Provide a valid email address' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update locally
      onUserUpdate({ ...user, name, email });
      setSuccessMessage('Profile details updated successfully!');
    } catch (err) {
      setErrors({ global: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">User Profile</h1>
        <p className="text-xs text-gray-500">Manage your profile credentials and hackathon configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Summary */}
        <div className="md:col-span-1">
          <Card className="text-center !py-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center border border-primary-200 shadow-sm mb-4">
              <User className="h-10 w-10" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-snug">{user.name}</h2>
            <p className="text-xs text-gray-500">{user.email}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-250">
              <Shield className="h-3 w-3" />
              Developer Role
            </div>
          </Card>
        </div>

        {/* Right Card: Form Settings */}
        <div className="md:col-span-2">
          <Card title="Account Settings" subtitle="Edit details and save them to simulated session context.">
            {successMessage && (
              <div className="mb-4 rounded-md bg-green-50 p-4 border border-green-200 flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div className="text-sm font-semibold text-green-800">{successMessage}</div>
              </div>
            )}

            {errors.global && (
              <p className="mb-4 text-sm text-red-600 font-semibold">{errors.global}</p>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Full Name"
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                disabled={isLoading}
              />

              <Input
                label="Email Address"
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                disabled={isLoading}
              />

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  isLoading={isLoading}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
