
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';

const Profile = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    location: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        location: profile.location || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate phone number
      if (!/^[0-9]+$/.test(formData.phone_number)) {
        throw new Error('Phone number must contain only numbers (including country code)');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          location: formData.location,
        })
        .eq('id', user?.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) return null;

  return (
    <AuthenticatedLayout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-serif font-bold mb-6">Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="full_name" className="block text-sm font-medium">
              Full Name
            </label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone_number" className="block text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Country code + number (numbers only)"
              pattern="[0-9]+"
              required
            />
            <p className="text-sm text-muted-foreground">
              Include country code, numbers only (e.g., 34612345678)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium">
              Address or Meeting Point
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <p className="text-sm text-muted-foreground">
              Can be your home address or a nearby spot you can meet at. Other users will only see your approximate location.
            </p>
          </div>

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </div>
    </AuthenticatedLayout>
  );
};

export default Profile;
