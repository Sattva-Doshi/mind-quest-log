import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addHabit } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface HabitFormProps {
  onSuccess: () => void;
}

const HABIT_COLORS = [
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#10B981", // green
  "#3B82F6", // blue
  "#F59E0B", // amber
  "#EF4444", // red
];

export const HabitForm = ({ onSuccess }: HabitFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("daily");
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addHabit({
      name: name.trim(),
      description: description.trim(),
      frequency,
      goal: 1,
      color,
    });

    toast({
      title: "Habit created!",
      description: "Time to build that streak 🔥",
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Habit Name *</Label>
        <Input
          id="name"
          placeholder="e.g., Morning meditation"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Why is this habit important to you?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency</Label>
        <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex gap-2">
          {HABIT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`w-10 h-10 rounded-full transition-transform ${
                color === c ? "scale-110 ring-2 ring-offset-2 ring-primary" : ""
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Habit
      </Button>
    </form>
  );
};
