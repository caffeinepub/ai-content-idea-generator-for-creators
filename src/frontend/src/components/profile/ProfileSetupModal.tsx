import { useState } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

export default function ProfileSetupModal() {
  const { needsProfileSetup, isAuthenticated, isFetched } = useCurrentUser();
  const saveProfile = useSaveCallerUserProfile();
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [bio, setBio] = useState('');

  const showModal = isAuthenticated && needsProfileSetup && isFetched;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        bio: bio.trim(),
        niche: niche.trim(),
        targetAudience: '',
        contentStyle: [],
        contentCategory: [],
        postingFrequency: BigInt(0),
        goals: '',
        createdAt: BigInt(Date.now() * 1000000),
      });
      toast.success('Profile created successfully!');
    } catch (error) {
      console.error('Profile setup error:', error);
      toast.error('Failed to create profile. Please try again.');
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">Welcome, Creator!</DialogTitle>
          <DialogDescription className="text-center">
            Let's set up your profile to personalize your content creation experience.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="niche">Your Niche (Optional)</Label>
            <Input
              id="niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., Fitness, Tech, Lifestyle"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Short Bio (Optional)</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? 'Creating Profile...' : 'Get Started'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
