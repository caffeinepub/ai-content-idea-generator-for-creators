import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { resetOnboarding } from '../lib/onboardingStorage';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, User, RotateCcw, Palette, Save, Loader2 } from 'lucide-react';
import type { UserProfile } from '../backend';

export default function SettingsPage() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const { theme, setTheme } = useTheme();

  // Form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [niche, setNiche] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [goals, setGoals] = useState('');
  const [postingFrequency, setPostingFrequency] = useState('3');

  // Load profile data into form
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setBio(userProfile.bio || '');
      setNiche(userProfile.niche || '');
      setTargetAudience(userProfile.targetAudience || '');
      setGoals(userProfile.goals || '');
      setPostingFrequency(String(userProfile.postingFrequency || 3));
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    if (!userProfile) {
      toast.error('Profile not loaded');
      return;
    }

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      const updatedProfile: UserProfile = {
        ...userProfile,
        name: name.trim(),
        bio: bio.trim(),
        niche: niche.trim(),
        targetAudience: targetAudience.trim(),
        goals: goals.trim(),
        postingFrequency: BigInt(parseInt(postingFrequency) || 3),
      };

      await saveProfile.mutateAsync(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleResetOnboarding = () => {
    try {
      resetOnboarding();
      toast.success('Onboarding reset successfully. You can access it again from the footer.');
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
      toast.error('Failed to reset onboarding');
    }
  };

  if (profileLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Update your personal information and content preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="niche">Niche</Label>
                <Input
                  id="niche"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g., Tech, Fitness, Lifestyle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Young professionals"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals">Goals</Label>
              <Textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="What do you want to achieve with your content?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postingFrequency">Posting Frequency (posts per week)</Label>
              <Input
                id="postingFrequency"
                type="number"
                min="1"
                max="30"
                value={postingFrequency}
                onChange={(e) => setPostingFrequency(e.target.value)}
              />
            </div>

            <Button
              onClick={handleSaveProfile}
              disabled={saveProfile.isPending}
              className="gap-2"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Onboarding Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              <CardTitle>Onboarding</CardTitle>
            </div>
            <CardDescription>Reset your onboarding progress to see the welcome tour again</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleResetOnboarding}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Onboarding
            </Button>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize how ContentSpark looks on your device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label>Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="w-full"
                >
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="w-full"
                >
                  Dark
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setTheme('system')}
                  className="w-full"
                >
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
