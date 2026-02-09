import { useState } from 'react';
import { Plus, Package, Trash2, Save, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  useGetUserMonetizationOffers,
  useSaveMonetizationOffer,
  useUpdateMonetizationOffer,
} from '../../hooks/useQueries';
import type { MonetizationOffer } from '../../backend';

export default function OfferGenerator() {
  const { data: offers = [], isLoading } = useGetUserMonetizationOffers();
  const saveOffer = useSaveMonetizationOffer();
  const updateOffer = useUpdateMonetizationOffer();

  const [isCreating, setIsCreating] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<MonetizationOffer | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'view'>('list');

  // Form state
  const [title, setTitle] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [problemSolved, setProblemSolved] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>(['']);
  const [priceRange, setPriceRange] = useState('');
  const [cta, setCta] = useState('');
  const [fulfillmentNotes, setFulfillmentNotes] = useState('');

  const resetForm = () => {
    setTitle('');
    setTargetCustomer('');
    setProblemSolved('');
    setDeliverables(['']);
    setPriceRange('');
    setCta('');
    setFulfillmentNotes('');
  };

  const handleAddDeliverable = () => {
    setDeliverables([...deliverables, '']);
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleDeliverableChange = (index: number, value: string) => {
    const updated = [...deliverables];
    updated[index] = value;
    setDeliverables(updated);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!cta.trim()) {
      toast.error('Call to action is required');
      return;
    }

    const filteredDeliverables = deliverables.filter((d) => d.trim() !== '');

    try {
      const offerData: MonetizationOffer = {
        id: BigInt(0),
        title: title.trim(),
        targetCustomer: targetCustomer.trim(),
        problemSolved: problemSolved.trim(),
        deliverables: filteredDeliverables,
        priceRange: priceRange.trim(),
        cta: cta.trim(),
        fulfillmentNotes: fulfillmentNotes.trim(),
        createdAt: BigInt(Date.now() * 1000000),
        lastUpdated: BigInt(Date.now() * 1000000),
      };

      await saveOffer.mutateAsync(offerData);
      toast.success('Offer saved successfully');
      resetForm();
      setViewMode('list');
    } catch (error) {
      console.error('Failed to save offer:', error);
      toast.error('Failed to save offer');
    }
  };

  const handleViewOffer = (offer: MonetizationOffer) => {
    setSelectedOffer(offer);
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

  if (viewMode === 'view' && selectedOffer) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>Offer Details</CardTitle>
            </div>
            <Button variant="outline" onClick={() => setViewMode('list')}>
              Back to List
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">{selectedOffer.title}</h3>
            <p className="text-sm text-muted-foreground">
              Created {new Date(Number(selectedOffer.createdAt) / 1000000).toLocaleDateString()}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Target Customer</Label>
              <p className="text-muted-foreground mt-1">{selectedOffer.targetCustomer || 'Not specified'}</p>
            </div>

            <div>
              <Label className="text-base font-semibold">Problem Solved</Label>
              <p className="text-muted-foreground mt-1">{selectedOffer.problemSolved || 'Not specified'}</p>
            </div>

            <div>
              <Label className="text-base font-semibold">Deliverables</Label>
              <ul className="list-disc list-inside space-y-1 mt-1 text-muted-foreground">
                {selectedOffer.deliverables.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <Label className="text-base font-semibold">Price Range</Label>
              <p className="text-muted-foreground mt-1">{selectedOffer.priceRange || 'Not specified'}</p>
            </div>

            <div>
              <Label className="text-base font-semibold">Call to Action</Label>
              <p className="text-muted-foreground mt-1">{selectedOffer.cta}</p>
            </div>

            {selectedOffer.fulfillmentNotes && (
              <div>
                <Label className="text-base font-semibold">Fulfillment Notes</Label>
                <p className="text-muted-foreground mt-1">{selectedOffer.fulfillmentNotes}</p>
              </div>
            )}
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
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>Create New Offer</CardTitle>
            </div>
            <Button variant="outline" onClick={() => setViewMode('list')}>
              Cancel
            </Button>
          </div>
          <CardDescription>
            Package your services into a clear, compelling offer that solves a specific problem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Offer Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Instagram Growth Package"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetCustomer">Target Customer</Label>
            <Input
              id="targetCustomer"
              value={targetCustomer}
              onChange={(e) => setTargetCustomer(e.target.value)}
              placeholder="e.g., Small business owners looking to grow on Instagram"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemSolved">Problem Solved</Label>
            <Textarea
              id="problemSolved"
              value={problemSolved}
              onChange={(e) => setProblemSolved(e.target.value)}
              placeholder="What specific problem does this offer solve?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Deliverables</Label>
            {deliverables.map((deliverable, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={deliverable}
                  onChange={(e) => handleDeliverableChange(index, e.target.value)}
                  placeholder={`Deliverable ${index + 1}`}
                />
                {deliverables.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveDeliverable(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddDeliverable} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Deliverable
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceRange">Price Range</Label>
            <Input
              id="priceRange"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              placeholder="e.g., $500 - $1,000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta">Call to Action *</Label>
            <Input
              id="cta"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder="e.g., DM me 'GROW' to get started"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fulfillmentNotes">Fulfillment Notes</Label>
            <Textarea
              id="fulfillmentNotes"
              value={fulfillmentNotes}
              onChange={(e) => setFulfillmentNotes(e.target.value)}
              placeholder="Internal notes about how you'll deliver this offer"
              rows={3}
            />
          </div>

          <Button onClick={handleSave} disabled={saveOffer.isPending} className="w-full gap-2">
            {saveOffer.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Offer
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
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>Your Offers</CardTitle>
            </div>
            <Button onClick={handleCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Offer
            </Button>
          </div>
          <CardDescription>
            Manage your service packages and monetization offers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {offers.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No offers created yet</p>
              <Button onClick={handleCreateNew} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Offer
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {offers.map((offer) => (
                <Card key={Number(offer.id)} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{offer.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {offer.targetCustomer || 'No target customer specified'}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOffer(offer)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </CardHeader>
                  {offer.priceRange && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        <strong>Price:</strong> {offer.priceRange}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
