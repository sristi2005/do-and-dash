import { Plus, Filter } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "high" | "medium" | "low";
}

const Tasks = () => {
  const tasks: Task[] = [
    { id: 1, title: "Design new homepage", status: "in-progress", priority: "high" },
    { id: 2, title: "Write blog post", status: "todo", priority: "medium" },
    { id: 3, title: "Update portfolio", status: "todo", priority: "low" },
    { id: 4, title: "Client meeting prep", status: "in-progress", priority: "high" },
    { id: 5, title: "Code review", status: "done", priority: "medium" },
  ];

  const columns = [
    { id: "todo", title: "To Do", color: "border-muted-foreground" },
    { id: "in-progress", title: "In Progress", color: "border-warning" },
    { id: "done", title: "Done", color: "border-accent" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-extrabold bg-gradient-primary bg-clip-text text-transparent">
                Task Board
              </h1>
              <p className="text-sm text-muted-foreground">Organize and conquer</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          {columns.map((column) => (
            <div key={column.id} className="space-y-3">
              <div className={`glass-card p-3 rounded-xl border-t-4 ${column.color}`}>
                <h3 className="font-heading font-bold text-lg">{column.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {tasks.filter((t) => t.status === column.id).length} tasks
                </p>
              </div>

              <div className="space-y-3">
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task, index) => (
                    <div
                      key={task.id}
                      className="glass-card p-4 rounded-xl shadow-card card-lift cursor-grab active:cursor-grabbing animate-scale-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <p className="font-medium text-foreground mb-2">{task.title}</p>
                      <Badge
                        variant={task.priority === "high" ? "default" : "secondary"}
                        className={
                          task.priority === "high"
                            ? "bg-primary/20 text-primary hover:bg-primary/30"
                            : task.priority === "medium"
                            ? "bg-warning/20 text-warning hover:bg-warning/30"
                            : "bg-accent/20 text-accent hover:bg-accent/30"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Button
        size="lg"
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-lift bg-gradient-primary hover:scale-110 transition-all duration-300 animate-float z-40"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <Navigation />
    </div>
  );
};

export default Tasks;
