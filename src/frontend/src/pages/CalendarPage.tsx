import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { useGetUserCalendarPosts } from '../hooks/useQueries';
import CalendarEntryDialog from '../components/calendar/CalendarEntryDialog';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import type { CalendarPost } from '../backend';
import { PostStatus } from '../backend';

export default function CalendarPage() {
  const { data: calendarPosts = [], isLoading } = useGetUserCalendarPosts();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getPostsForDate = (date: Date): CalendarPost[] => {
    return calendarPosts.filter((post) => {
      const postDate = new Date(Number(post.postTime) / 1000000);
      return isSameDay(postDate, date);
    });
  };

  const handleAddEntry = (date?: Date) => {
    setSelectedDate(date || new Date());
    setDialogOpen(true);
  };

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case PostStatus.draft:
        return 'secondary';
      case PostStatus.scheduled:
        return 'default';
      case PostStatus.published:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: PostStatus): string => {
    return status;
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground">Plan and schedule your content strategy.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'month' ? 'list' : 'month')}
          >
            {viewMode === 'month' ? <List className="h-4 w-4" /> : <CalendarIcon className="h-4 w-4" />}
          </Button>
          <Button onClick={() => handleAddEntry()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>

      {viewMode === 'month' ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
              <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                const posts = getPostsForDate(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={index}
                    onClick={() => handleAddEntry(day)}
                    className={`min-h-24 p-2 rounded-lg border text-left transition-colors hover:border-primary ${
                      isCurrentMonth ? 'bg-card' : 'bg-muted/30'
                    } ${isToday ? 'border-primary' : ''}`}
                  >
                    <div className="text-sm font-medium mb-1">{format(day, 'd')}</div>
                    <div className="space-y-1">
                      {posts.slice(0, 2).map((post) => (
                        <div
                          key={Number(post.id)}
                          className="text-xs p-1 rounded bg-primary/10 text-primary truncate"
                        >
                          {post.title}
                        </div>
                      ))}
                      {posts.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{posts.length - 2} more</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {calendarPosts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No scheduled content yet. Start planning!</p>
              </CardContent>
            </Card>
          ) : (
            calendarPosts
              .sort((a, b) => Number(b.postTime) - Number(a.postTime))
              .map((post) => (
                <Card key={Number(post.id)}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <CardDescription>
                          {format(new Date(Number(post.postTime) / 1000000), 'PPP')}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(post.postStatus)}>
                        {getStatusLabel(post.postStatus)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{post.objective}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{post.platform}</Badge>
                      <Badge variant="secondary">{post.theme}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      )}

      <CalendarEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate || new Date()}
      />
    </div>
  );
}
