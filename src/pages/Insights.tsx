import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHabits, getScreenTime, getHabitStreak, getCompletionRate } from "@/lib/storage";
import { TrendingUp, Award, Target, Clock } from "lucide-react";

const Insights = () => {
  const [totalCompletions, setTotalCompletions] = useState(0);
  const [avgCompletionRate, setAvgCompletionRate] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalScreenTime, setTotalScreenTime] = useState(0);

  useEffect(() => {
    const habits = getHabits();
    
    const completions = habits.reduce((sum, h) => sum + h.completions.length, 0);
    setTotalCompletions(completions);

    const rates = habits.map(h => getCompletionRate(h, 30));
    const avgRate = rates.length > 0 
      ? rates.reduce((sum, r) => sum + r, 0) / rates.length 
      : 0;
    setAvgCompletionRate(Math.round(avgRate));

    const streaks = habits.map(h => getHabitStreak(h));
    setLongestStreak(Math.max(0, ...streaks));

    const screenTime = getScreenTime();
    const total = screenTime.reduce((sum, e) => sum + e.minutes, 0);
    setTotalScreenTime(total);
  }, []);

  const stats = [
    {
      title: "Total Completions",
      value: totalCompletions,
      icon: Target,
      color: "text-primary",
    },
    {
      title: "Avg. Completion Rate",
      value: `${avgCompletionRate}%`,
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      title: "Longest Streak",
      value: `${longestStreak} days`,
      icon: Award,
      color: "text-orange-500",
    },
    {
      title: "Total Screen Time",
      value: `${Math.round(totalScreenTime / 60)}h`,
      icon: Clock,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-primary/5">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Insights</h1>
          <p className="text-muted-foreground">Your progress overview</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Keep Going! 🚀</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>You're building great habits! Here are some tips:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Consistency is key - aim for daily practice</li>
              <li>Start small and gradually increase difficulty</li>
              <li>Track your screen time to stay mindful</li>
              <li>Celebrate small wins along the way</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Insights;
