import { useState, useMemo } from 'react';
import { Plus, TrendingUp, DollarSign, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  useGetUserRevenueEntries,
  useGetUserRevenueGoals,
  useSaveRevenueEntry,
  useSaveRevenueGoal,
  useUpdateRevenueGoal,
} from '../../hooks/useQueries';
import type { RevenueEntry, RevenueGoal, RevenueSourceType } from '../../backend';

export default function RevenueTracker() {
  const { data: entries = [], isLoading: entriesLoading } = useGetUserRevenueEntries();
  const { data: goals = [], isLoading: goalsLoading } = useGetUserRevenueGoals();
  const saveEntry = useSaveRevenueEntry();
  const saveGoal = useSaveRevenueGoal();
  const updateGoal = useUpdateRevenueGoal();

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Goal form state
  const [goalAmount, setGoalAmount] = useState('');

  // Entry form state
  const [entryDate, setEntryDate] = useState('');
  const [sourceType, setSourceType] = useState<string>('affiliate');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const currentGoal = useMemo(() => {
    return goals.find((g) => g.month === selectedMonth);
  }, [goals, selectedMonth]);

  const monthEntries = useMemo(() => {
    return entries.filter((e) => e.date.startsWith(selectedMonth));
  }, [entries, selectedMonth]);

  const totalRevenue = useMemo(() => {
    return monthEntries.reduce((sum, entry) => sum + entry.amount, 0);
  }, [monthEntries]);

  const progress = useMemo(() => {
    if (!currentGoal || currentGoal.goalAmount === 0) return 0;
    return Math.min((totalRevenue / currentGoal.goalAmount) * 100, 100);
  }, [currentGoal, totalRevenue]);

  const handleSaveGoal = async () => {
    const parsedAmount = parseFloat(goalAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid goal amount');
      return;
    }

    try {
      if (currentGoal) {
        const updatedGoal: RevenueGoal = {
          ...currentGoal,
          goalAmount: parsedAmount,
          achievedAmount: totalRevenue,
          lastUpdated: BigInt(Date.now() * 1000000),
        };
        await updateGoal.mutateAsync({ goalId: currentGoal.id, updatedGoal });
        toast.success('Goal updated successfully');
      } else {
        const newGoal: RevenueGoal = {
          id: BigInt(0),
          month: selectedMonth,
          goalAmount: parsedAmount,
          achievedAmount: 0,
          createdAt: BigInt(Date.now() * 1000000),
          lastUpdated: BigInt(Date.now() * 1000000),
        };
        await saveGoal.mutateAsync(newGoal);
        toast.success('Goal saved successfully');
      }
      setGoalAmount('');
    } catch (error) {
      console.error('Failed to save goal:', error);
      toast.error('Failed to save goal');
    }
  };

  const handleSaveEntry = async () => {
    if (!entryDate) {
      toast.error('Date is required');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const sourceTypeMap: Record<string, RevenueSourceType> = {
        affiliate: { __kind__: 'affiliate', affiliate: null },
        brand: { __kind__: 'brand', brand: null },
        service: { __kind__: 'service', service: null },
        product: { __kind__: 'product', product: null },
      };

      const entry: RevenueEntry = {
        id: BigInt(0),
        date: entryDate,
        sourceType: sourceTypeMap[sourceType] || { __kind__: 'affiliate', affiliate: null },
        amount: parsedAmount,
        notes: notes.trim(),
        createdAt: BigInt(Date.now() * 1000000),
      };

      await saveEntry.mutateAsync(entry);
      toast.success('Revenue entry saved successfully');
      setEntryDate('');
      setAmount('');
      setNotes('');
    } catch (error) {
      console.error('Failed to save entry:', error);
      toast.error('Failed to save entry');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getSourceTypeLabel = (type: RevenueSourceType): string => {
    if (type.__kind__ === 'other') return type.other;
    return type.__kind__.charAt(0).toUpperCase() + type.__kind__.slice(1);
  };

  if (entriesLoading || goalsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Goal Setting */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Monthly Revenue Goal</CardTitle>
          </div>
          <CardDescription>Set and track your monthly revenue targets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="month">Month</Label>
              <Input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="goalAmount">Goal Amount ($)</Label>
              <div className="flex gap-2">
                <Input
                  id="goalAmount"
                  type="number"
                  step="0.01"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder={currentGoal ? String(currentGoal.goalAmount) : '1000'}
                />
                <Button
                  onClick={handleSaveGoal}
                  disabled={saveGoal.isPending || updateGoal.isPending}
                  className="gap-2"
                >
                  {saveGoal.isPending || updateGoal.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {currentGoal && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {formatCurrency(totalRevenue)} / {formatCurrency(currentGoal.goalAmount)}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {progress.toFixed(1)}% of goal achieved
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Revenue Entry */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <CardTitle>Add Revenue Entry</CardTitle>
          </div>
          <CardDescription>Record your earnings from various sources</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryDate">Date *</Label>
              <Input
                id="entryDate"
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceType">Source Type</Label>
              <Select value={sourceType} onValueChange={setSourceType}>
                <SelectTrigger id="sourceType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="affiliate">Affiliate</SelectItem>
                  <SelectItem value="brand">Brand Partnership</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="product">Product Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional details about this revenue"
              rows={2}
            />
          </div>

          <Button
            onClick={handleSaveEntry}
            disabled={saveEntry.isPending}
            className="w-full gap-2"
          >
            {saveEntry.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Entry
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Revenue Entries List */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Entries for {selectedMonth}</CardTitle>
          <CardDescription>
            {monthEntries.length} {monthEntries.length === 1 ? 'entry' : 'entries'} • Total:{' '}
            {formatCurrency(totalRevenue)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {monthEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No revenue entries for this month yet
            </div>
          ) : (
            <div className="space-y-4">
              {monthEntries.map((entry) => (
                <div key={Number(entry.id)} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{formatCurrency(entry.amount)}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {getSourceTypeLabel(entry.sourceType)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.date}</p>
                    {entry.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
