import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHabits, toggleHabitCompletion, getHabitStreak, type Habit } from "@/lib/storage";
import { Plus, Flame, CheckCircle2, Circle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HabitForm } from "@/components/HabitForm";
import { useToast } from "@/hooks/use-toast";

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  const loadHabits = () => {
    setHabits(getHabits());
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleToggleComplete = (habitId: string) => {
    toggleHabitCompletion(habitId, today);
    loadHabits();
    toast({
      title: "Great job!",
      description: "Keep up the momentum 🎉",
    });
  };

  const isCompletedToday = (habit: Habit) => {
    return habit.completions.some(c => c.date === today);
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-primary/5">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Habits</h1>
            <p className="text-muted-foreground">Track your daily progress</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Habit</DialogTitle>
              </DialogHeader>
              <HabitForm
                onSuccess={() => {
                  loadHabits();
                  setDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Habits List */}
        {habits.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <div className="text-6xl">🎯</div>
              <div>
                <h3 className="font-semibold mb-2">No habits yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start building better habits today!
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Habit
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => {
              const completed = isCompletedToday(habit);
              const streak = getHabitStreak(habit);

              return (
                <Card
                  key={habit.id}
                  className={`transition-all ${
                    completed ? 'border-accent bg-accent/5' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: habit.color }}
                          />
                          {habit.name}
                        </CardTitle>
                        {habit.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {habit.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant={completed ? "default" : "outline"}
                        size="icon"
                        className={completed ? "bg-accent hover:bg-accent/90" : ""}
                        onClick={() => handleToggleComplete(habit.id)}
                      >
                        {completed ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground capitalize">
                          {habit.frequency}
                        </span>
                        {streak > 0 && (
                          <div className="flex items-center gap-1 text-orange-500">
                            <Flame className="h-4 w-4" />
                            <span className="font-semibold">{streak} days</span>
                          </div>
                        )}
                      </div>
                      <span className="text-muted-foreground">
                        {habit.completions.length} total
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Habits;
