import { useState } from 'react';
import { Plus, Mail, Copy, Save, Loader2, Eye, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { copyToClipboard } from '../../utils/clipboard';
import { generateBrandPitch } from '../../lib/brandPitchBuilder';
import {
  useGetUserBrandPitches,
  useSaveBrandPitch,
  useGetCallerUserProfile,
} from '../../hooks/useQueries';
import type { BrandPitch } from '../../backend';

export default function BrandPitchBuilder() {
  const { data: pitches = [], isLoading } = useGetUserBrandPitches();
  const { data: userProfile } = useGetCallerUserProfile();
  const savePitch = useSaveBrandPitch();

  const [viewMode, setViewMode] = useState<'list' | 'create' | 'view'>('list');
  const [selectedPitch, setSelectedPitch] = useState<BrandPitch | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Form state
  const [brandName, setBrandName] = useState('');
  const [product, setProduct] = useState('');
  const [collaborationType, setCollaborationType] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');

  // Generated pitch state
  const [generatedPitch, setGeneratedPitch] = useState<{
    shortPitchDM: string;
    emailPitch: string;
    followUpMessages: string[];
  } | null>(null);

  const resetForm = () => {
    setBrandName('');
    setProduct('');
    setCollaborationType('');
    setDesiredOutcome('');
    setGeneratedPitch(null);
  };

  const handleGenerate = () => {
    if (!brandName.trim() || !product.trim() || !collaborationType.trim() || !desiredOutcome.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const pitch = generateBrandPitch(
      {
        brandName: brandName.trim(),
        product: product.trim(),
        collaborationType: collaborationType.trim(),
        desiredOutcome: desiredOutcome.trim(),
      },
      userProfile || undefined
    );

    setGeneratedPitch(pitch);
  };

  const handleCopy = async (text: string, index: number) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(index);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleSave = async () => {
    if (!generatedPitch) {
      toast.error('Please generate a pitch first');
      return;
    }

    try {
      const pitchData: BrandPitch = {
        id: BigInt(0),
        brandName: brandName.trim(),
        product: product.trim(),
        collaborationType: collaborationType.trim(),
        desiredOutcome: desiredOutcome.trim(),
        shortPitchDM: generatedPitch.shortPitchDM,
        emailPitch: generatedPitch.emailPitch,
        followUpMessages: generatedPitch.followUpMessages,
        createdAt: BigInt(Date.now() * 1000000),
        lastUpdated: BigInt(Date.now() * 1000000),
      };

      await savePitch.mutateAsync(pitchData);
      toast.success('Pitch saved successfully');
      resetForm();
      setViewMode('list');
    } catch (error) {
      console.error('Failed to save pitch:', error);
      toast.error('Failed to save pitch');
    }
  };

  const handleViewPitch = (pitch: BrandPitch) => {
    setSelectedPitch(pitch);
    setViewMode('view');
  };

  const handleCreateNew = () => {
    resetForm();
    setViewMode('create');
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

  if (viewMode === 'view' && selectedPitch) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Pitch Details</CardTitle>
            </div>
            <Button variant="outline" onClick={() => setViewMode('list')}>
              Back to List
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">{selectedPitch.brandName}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedPitch.product} • {selectedPitch.collaborationType}
            </p>
          </div>

          <Separator />

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-semibold">DM Pitch</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(selectedPitch.shortPitchDM, 0)}
                  className="gap-2"
                >
                  {copiedIndex === 0 ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{selectedPitch.shortPitchDM}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-semibold">Email Pitch</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(selectedPitch.emailPitch, 1)}
                  className="gap-2"
                >
                  {copiedIndex === 1 ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{selectedPitch.emailPitch}</p>
              </div>
            </div>

            {selectedPitch.followUpMessages.map((message, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-semibold">Follow-up #{idx + 1}</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(message, idx + 2)}
                    className="gap-2"
                  >
                    {copiedIndex === idx + 2 ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm whitespace-pre-wrap">{message}</p>
                </div>
              </div>
            ))}
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
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Create Brand Pitch</CardTitle>
            </div>
            <Button variant="outline" onClick={() => setViewMode('list')}>
              Cancel
            </Button>
          </div>
          <CardDescription>
            Generate professional pitch messages for brand collaborations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name *</Label>
              <Input
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g., Nike"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Product/Offer *</Label>
              <Input
                id="product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g., New running shoes line"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collaborationType">Collaboration Type *</Label>
              <Input
                id="collaborationType"
                value={collaborationType}
                onChange={(e) => setCollaborationType(e.target.value)}
                placeholder="e.g., Sponsored post, Product review, Affiliate partnership"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desiredOutcome">Desired Outcome *</Label>
              <Textarea
                id="desiredOutcome"
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                placeholder="What do you want to achieve with this collaboration?"
                rows={3}
              />
            </div>

            <Button onClick={handleGenerate} className="w-full gap-2">
              <Mail className="h-4 w-4" />
              Generate Pitch
            </Button>
          </div>

          {generatedPitch && (
            <>
              <Separator />

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-base font-semibold">DM Pitch</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(generatedPitch.shortPitchDM, 0)}
                      className="gap-2"
                    >
                      {copiedIndex === 0 ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm whitespace-pre-wrap">{generatedPitch.shortPitchDM}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-base font-semibold">Email Pitch</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(generatedPitch.emailPitch, 1)}
                      className="gap-2"
                    >
                      {copiedIndex === 1 ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm whitespace-pre-wrap">{generatedPitch.emailPitch}</p>
                  </div>
                </div>

                {generatedPitch.followUpMessages.map((message, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base font-semibold">Follow-up #{idx + 1}</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(message, idx + 2)}
                        className="gap-2"
                      >
                        {copiedIndex === idx + 2 ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm whitespace-pre-wrap">{message}</p>
                    </div>
                  </div>
                ))}

                <Button
                  onClick={handleSave}
                  disabled={savePitch.isPending}
                  className="w-full gap-2"
                >
                  {savePitch.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Pitch
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
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
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Your Brand Pitches</CardTitle>
            </div>
            <Button onClick={handleCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Pitch
            </Button>
          </div>
          <CardDescription>
            Manage your brand collaboration pitch templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pitches.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No pitches created yet</p>
              <Button onClick={handleCreateNew} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Pitch
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {pitches.map((pitch) => (
                <Card key={Number(pitch.id)} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{pitch.brandName}</CardTitle>
                        <CardDescription className="mt-1">
                          {pitch.product} • {pitch.collaborationType}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPitch(pitch)}
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
