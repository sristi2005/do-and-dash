import { useState, useEffect } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

const QuickTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error loading tasks",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setTasks(data || []);
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const priorityColors = {
    high: "border-primary",
    medium: "border-warning",
    low: "border-accent",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">Quick Tasks</h2>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </div>
      
      {tasks.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl text-center">
          <p className="text-muted-foreground">No tasks yet. Click the + button to add your first task!</p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={cn(
              "glass-card min-w-[280px] p-4 rounded-2xl border-l-4 card-lift snap-start",
              "animate-slide-up shadow-card",
              priorityColors[task.priority]
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium text-foreground">{task.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full font-medium",
                    task.priority === "high" && "bg-primary/20 text-primary",
                    task.priority === "medium" && "bg-warning/20 text-warning",
                    task.priority === "low" && "bg-accent/20 text-accent"
                  )}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "transition-colors",
                  task.completed ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                <CheckCircle2 className={cn("h-6 w-6", task.completed && "fill-current")} />
              </button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default QuickTasks;
