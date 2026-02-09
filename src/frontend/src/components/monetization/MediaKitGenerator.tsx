import { useState, useEffect } from 'react';
import { Plus, FileText, Save, Loader2, Eye, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  useGetUserMediaKits,
  useSaveMediaKit,
  useGetCallerUserProfile,
} from '../../hooks/useQueries';
import type { MediaKit } from '../../backend';

export default function MediaKitGenerator() {
  const { data: kits = [], isLoading } = useGetUserMediaKits();
  const { data: userProfile } = useGetCallerUserProfile();
  const saveKit = useSaveMediaKit();

  const [viewMode, setViewMode] = useState<'list' | 'create' | 'view'>('list');
  const [selectedKit, setSelectedKit] = useState<MediaKit | null>(null);

  // Form state
  const [handles, setHandles] = useState<string[]>(['']);
  const [contentNiches, setContentNiches] = useState<string[]>(['']);
  const [audienceDescription, setAudienceDescription] = useState('');
  const [contentPillars, setContentPillars] = useState<string[]>(['']);
  const [sampleDeliverables, setSampleDeliverables] = useState<string[]>(['']);
  const [contactEmail, setContactEmail] = useState('');

  // Prefill from user profile
  useEffect(() => {
    if (userProfile && viewMode === 'create') {
      if (userProfile.niche) {
        setContentNiches([userProfile.niche]);
      }
      if (userProfile.targetAudience) {
        setAudienceDescription(userProfile.targetAudience);
      }
    }
  }, [userProfile, viewMode]);

  const resetForm = () => {
    setHandles(['']);
    setContentNiches(['']);
    setAudienceDescription('');
    setContentPillars(['']);
    setSampleDeliverables(['']);
    setContactEmail('');
  };

  const handleAddItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, '']);
  };

  const handleRemoveItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSave = async () => {
    if (!userProfile) {
      toast.error('User profile not loaded');
      return;
    }

    const filteredHandles = handles.filter((h) => h.trim() !== '');
    const filteredNiches = contentNiches.filter((n) => n.trim() !== '');
    const filteredPillars = contentPillars.filter((p) => p.trim() !== '');
    const filteredDeliverables = sampleDeliverables.filter((d) => d.trim() !== '');

    if (filteredHandles.length === 0) {
      toast.error('At least one social media handle is required');
      return;
    }

    try {
      const kitData: MediaKit = {
        id: BigInt(0),
        userProfile,
        handles: filteredHandles,
        contentNiches: filteredNiches,
        audienceDescription: audienceDescription.trim(),
        contentPillars: filteredPillars,
        sampleDeliverables: filteredDeliverables,
        contactEmail: contactEmail.trim(),
        createdAt: BigInt(Date.now() * 1000000),
        lastUpdated: BigInt(Date.now() * 1000000),
      };

      await saveKit.mutateAsync(kitData);
      toast.success('Media kit saved successfully');
      resetForm();
      setViewMode('list');
    } catch (error) {
      console.error('Failed to save media kit:', error);
      toast.error('Failed to save media kit');
    }
  };

  const handleViewKit = (kit: MediaKit) => {
    setSelectedKit(kit);
    setViewMode('view');
  };

  const handleCreateNew = () => {
    resetForm();
    setViewMode('create');
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'view' && selectedKit) {
    return (
      <Card>
        <CardHeader className="print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Media Kit</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" onClick={() => setViewMode('list')}>
                Back to List
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 print:p-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">{selectedKit.userProfile.name}</h2>
            <p className="text-lg text-muted-foreground">{selectedKit.userProfile.bio}</p>
            {selectedKit.contactEmail && (
              <p className="text-sm text-muted-foreground">{selectedKit.contactEmail}</p>
            )}
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Social Media</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {selectedKit.handles.map((handle, idx) => (
                  <li key={idx}>{handle}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Content Niches</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {selectedKit.contentNiches.map((niche, idx) => (
                  <li key={idx}>{niche}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Audience</h3>
            <p className="text-sm text-muted-foreground">{selectedKit.audienceDescription}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Content Pillars</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {selectedKit.contentPillars.map((pillar, idx) => (
                <li key={idx}>{pillar}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Sample Deliverables</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {selectedKit.sampleDeliverables.map((deliverable, idx) => (
                <li key={idx}>{deliverable}</li>
              ))}
            </ul>
          </div>

          <div className="text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Interested in collaborating? Let's connect!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'create') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Create Media Kit</CardTitle>
            </div>
            <Button variant="outline" onClick={() => setViewMode('list')}>
              Cancel
            </Button>
          </div>
          <CardDescription>
            Build a professional one-page media kit for brand partnerships
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Social Media Handles *</Label>
            {handles.map((handle, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={handle}
                  onChange={(e) => handleItemChange(setHandles, index, e.target.value)}
                  placeholder="@username on Platform"
                />
                {handles.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveItem(setHandles, index)}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddItem(setHandles)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Handle
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Content Niches</Label>
            {contentNiches.map((niche, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={niche}
                  onChange={(e) => handleItemChange(setContentNiches, index, e.target.value)}
                  placeholder="e.g., Tech, Lifestyle, Fitness"
                />
                {contentNiches.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveItem(setContentNiches, index)}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddItem(setContentNiches)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Niche
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="audienceDescription">Audience Description</Label>
            <Textarea
              id="audienceDescription"
              value={audienceDescription}
              onChange={(e) => setAudienceDescription(e.target.value)}
              placeholder="Describe your target audience demographics and interests"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Content Pillars</Label>
            {contentPillars.map((pillar, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={pillar}
                  onChange={(e) => handleItemChange(setContentPillars, index, e.target.value)}
                  placeholder="Main content theme"
                />
                {contentPillars.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveItem(setContentPillars, index)}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddItem(setContentPillars)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Pillar
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Sample Deliverables</Label>
            {sampleDeliverables.map((deliverable, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={deliverable}
                  onChange={(e) =>
                    handleItemChange(setSampleDeliverables, index, e.target.value)
                  }
                  placeholder="e.g., 1 Instagram Reel, 3 Stories, 1 Feed Post"
                />
                {sampleDeliverables.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveItem(setSampleDeliverables, index)}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddItem(setSampleDeliverables)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Deliverable
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <Button onClick={handleSave} disabled={saveKit.isPending} className="w-full gap-2">
            {saveKit.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Media Kit
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Your Media Kits</CardTitle>
            </div>
            <Button onClick={handleCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Media Kit
            </Button>
          </div>
          <CardDescription>
            Manage your professional media kits for brand outreach
          </CardDescription>
        </CardHeader>
        <CardContent>
          {kits.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No media kits created yet</p>
              <Button onClick={handleCreateNew} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Media Kit
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {kits.map((kit) => (
                <Card key={Number(kit.id)} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{kit.userProfile.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {kit.contentNiches.join(', ')}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewKit(kit)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
