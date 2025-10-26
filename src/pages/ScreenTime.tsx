import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getScreenTime, addScreenTimeEntry, type ScreenTimeEntry } from "@/lib/storage";
import { Smartphone, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const POPULAR_APPS = [
  { name: "Facebook", icon: "📘" },
  { name: "Instagram", icon: "📷" },
  { name: "WhatsApp", icon: "💬" },
  { name: "YouTube", icon: "📺" },
  { name: "Gaming", icon: "🎮" },
  { name: "Other", icon: "📱" },
];

const ScreenTime = () => {
  const [entries, setEntries] = useState<ScreenTimeEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState("");
  const [minutes, setMinutes] = useState("");
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  const loadEntries = () => {
    const allEntries = getScreenTime();
    const todayEntries = allEntries.filter(e => e.date === today);
    setEntries(todayEntries);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !minutes) return;

    addScreenTimeEntry({
      app: selectedApp,
      minutes: parseInt(minutes),
      date: today,
    });

    toast({
      title: "Screen time logged",
      description: "Tracking helps build awareness 👀",
    });

    setSelectedApp("");
    setMinutes("");
    setDialogOpen(false);
    loadEntries();
  };

  const totalMinutes = entries.reduce((sum, e) => sum + e.minutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-primary/5">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Screen Time</h1>
            <p className="text-muted-foreground">Track your digital wellbeing</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Screen Time</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>App</Label>
                  <Select value={selectedApp} onValueChange={setSelectedApp}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an app" />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_APPS.map((app) => (
                        <SelectItem key={app.name} value={app.name}>
                          {app.icon} {app.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minutes">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    placeholder="e.g., 30"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Log Time
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Total Today */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Total Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {hours > 0 && `${hours}h `}
              {mins}m
            </div>
            {entries.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Across {entries.length} {entries.length === 1 ? 'app' : 'apps'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* App Breakdown */}
        {entries.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Today's Breakdown</h2>
            {entries.map((entry) => {
              const app = POPULAR_APPS.find(a => a.name === entry.app);
              const percentage = (entry.minutes / totalMinutes) * 100;

              return (
                <Card key={entry.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{app?.icon}</span>
                        <span className="font-medium">{entry.app}</span>
                      </div>
                      <span className="font-semibold">{entry.minutes}m</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <div className="text-6xl">📱</div>
              <div>
                <h3 className="font-semibold mb-2">No screen time logged today</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start tracking your digital habits
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Log Screen Time
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScreenTime;
