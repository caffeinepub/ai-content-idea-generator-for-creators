import { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaveCalendarPost } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { PostStatus } from '../../backend';

interface CalendarEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
}

export default function CalendarEntryDialog({
  open,
  onOpenChange,
  selectedDate,
}: CalendarEntryDialogProps) {
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [status, setStatus] = useState<PostStatus>(PostStatus.draft);
  const [theme, setTheme] = useState('');
  const savePost = useSaveCalendarPost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      await savePost.mutateAsync({
        id: BigInt(Date.now()),
        title: title.trim(),
        objective: objective.trim(),
        platform,
        theme: theme.trim(),
        postTime: BigInt(selectedDate.getTime() * 1000000),
        postStatus: status,
        contentType: { __kind__: 'educational', educational: null },
        contentStyle: { __kind__: 'talkingHead', talkingHead: null },
        format: 'Reel',
        engagementGoal: '',
        suggestedCaptions: [],
        createdAt: BigInt(Date.now() * 1000000),
        lastUpdated: BigInt(Date.now() * 1000000),
      });
      toast.success('Calendar entry saved');
      onOpenChange(false);
      setTitle('');
      setObjective('');
      setTheme('');
    } catch (error) {
      toast.error('Failed to save entry');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Calendar Entry</DialogTitle>
          <DialogDescription>
            Schedule content for {format(selectedDate, 'PPP')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Content title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objective">Objective</Label>
            <Textarea
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="What's the goal of this content?"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger id="platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as PostStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PostStatus.draft}>Draft</SelectItem>
                  <SelectItem value={PostStatus.scheduled}>Scheduled</SelectItem>
                  <SelectItem value={PostStatus.published}>Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme (Optional)</Label>
            <Input
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g., Motivational Monday"
            />
          </div>

          <Button type="submit" className="w-full" disabled={savePost.isPending}>
            {savePost.isPending ? 'Saving...' : 'Save Entry'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
