import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setUser } from "@/lib/storage";
import { Sparkles } from "lucide-react";

const Onboarding = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setUser({ name: name.trim(), onboarded: true });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md text-center space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Sparkles className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome to Habitly
          </h1>
          <p className="text-muted-foreground text-lg">
            Your personal companion for building better habits and mindful screen time
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="What's your name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-14 text-lg text-center"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity"
            disabled={!name.trim()}
          >
            Get Started
          </Button>
        </form>

        <p className="text-sm text-muted-foreground">
          All your data stays on your device 🔒
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
