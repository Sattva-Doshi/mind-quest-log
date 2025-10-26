import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHabits, getScreenTime, getUser, getHabitStreak } from "@/lib/storage";
import { BarChart3, Target, TrendingUp, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [totalHabits, setTotalHabits] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalScreenTime, setTotalScreenTime] = useState(0);

  useEffect(() => {
    const user = getUser();
    if (user) setUserName(user.name);

    const habits = getHabits();
    const today = new Date().toISOString().split('T')[0];
    
    setTotalHabits(habits.length);
    
    const completedCount = habits.filter(h => 
      h.completions.some(c => c.date === today)
    ).length;
    setCompletedToday(completedCount);

    const streaks = habits.map(h => getHabitStreak(h));
    setBestStreak(Math.max(0, ...streaks));

    const screenTime = getScreenTime();
    const todayScreenTime = screenTime
      .filter(e => e.date === today)
      .reduce((sum, e) => sum + e.minutes, 0);
    setTotalScreenTime(todayScreenTime);
  }, []);

  const stats = [
    {
      title: "Active Habits",
      value: totalHabits,
      icon: Target,
      color: "text-primary",
      link: "/habits"
    },
    {
      title: "Completed Today",
      value: completedToday,
      icon: TrendingUp,
      color: "text-accent",
      link: "/habits"
    },
    {
      title: "Best Streak",
      value: `${bestStreak} days`,
      icon: BarChart3,
      color: "text-primary",
      link: "/insights"
    },
    {
      title: "Screen Time Today",
      value: `${totalScreenTime}m`,
      icon: Clock,
      color: "text-muted-foreground",
      link: "/screen-time"
    },
  ];

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-primary/5">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Hi, {userName} 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your progress today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/habits">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add New Habit
              </Button>
            </Link>
            <Link to="/screen-time">
              <Button className="w-full justify-start" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Log Screen Time
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Motivational Quote */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm italic text-center">
              "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
            </p>
            <p className="text-xs text-center text-muted-foreground mt-2">
              — Aristotle
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
