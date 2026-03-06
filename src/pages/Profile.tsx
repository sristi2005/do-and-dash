import { Settings, Award, TrendingUp, Zap, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const stats = [
    { label: "Tasks Completed", value: 127, icon: Zap, color: "text-primary" },
    { label: "Current Streak", value: 12, icon: TrendingUp, color: "text-warning" },
    { label: "Achievements", value: 8, icon: Award, color: "text-accent" },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "See you soon!",
      });
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-extrabold bg-gradient-primary bg-clip-text text-transparent">
            Profile
          </h1>
          <div className="flex items-center gap-2">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Profile Header */}
        <div className="glass-card p-6 rounded-2xl shadow-card text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary animate-pulse-glow">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold text-3xl">
              ME
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-heading font-bold mb-1">Your Name</h2>
          <p className="text-muted-foreground mb-4">Productivity Champion 🏆</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Weekly Progress</span>
              <span className="font-semibold text-primary">85%</span>
            </div>
            <Progress value={85} className="h-3" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="glass-card p-4 text-center border-border card-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-heading font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Activity Chart */}
        <div className="glass-card p-6 rounded-2xl shadow-card">
          <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Activity This Week
          </h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {[40, 65, 50, 85, 70, 95, 80].map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-primary rounded-t-lg animate-scale-in"
                style={{
                  height: `${height}%`,
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card p-6 rounded-2xl shadow-card">
          <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-warning" />
            Recent Achievements
          </h3>
          <div className="space-y-3">
            {[
              { title: "First Week Streak", emoji: "🔥" },
              { title: "Early Bird", emoji: "🌅" },
              { title: "Team Player", emoji: "🤝" },
            ].map((achievement, index) => (
              <div
                key={achievement.title}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-3xl">{achievement.emoji}</span>
                <span className="font-medium">{achievement.title}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Profile;
