import { useState, useEffect } from "react";
import { Check, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  title: string;
  completed: boolean;
}

const TodaysGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error loading goals",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setGoals(data || []);
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progressPercent = goals.length > 0 ? (completedCount / goals.length) * 100 : 0;

  const toggleGoal = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const { error } = await supabase
      .from('goals')
      .update({ completed: !goal.completed })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setGoals(goals.map(g => 
      g.id === id ? { ...g, completed: !g.completed } : g
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-heading font-bold">Today's Goals</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{goals.length}
        </span>
      </div>

      <div className="glass-card p-4 rounded-2xl shadow-card">
        {goals.length > 0 && <Progress value={progressPercent} className="h-2 mb-4" />}
        
        {goals.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No goals yet. Click the + button to add your first goal!</p>
        ) : (
          <div className="space-y-3">
          {goals.map((goal, index) => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                "hover:bg-muted/50 animate-scale-in",
                goal.completed && "opacity-60"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all",
                goal.completed 
                  ? "bg-primary border-primary scale-110" 
                  : "border-muted-foreground hover:border-primary"
              )}>
                {goal.completed && <Check className="h-4 w-4 text-primary-foreground" />}
              </div>
              <span className={cn(
                "flex-1 text-left font-medium",
                goal.completed && "line-through"
              )}>
                {goal.title}
              </span>
            </button>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysGoals;
