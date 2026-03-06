import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded: () => void;
}

const AddItemDialog = ({ open, onOpenChange, onItemAdded }: AddItemDialogProps) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [goalTitle, setGoalTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add tasks",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: taskTitle,
        priority: taskPriority,
        completed: false,
      });

    setLoading(false);

    if (error) {
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Task added!",
      description: "Your new task has been created.",
    });

    setTaskTitle("");
    setTaskPriority("medium");
    onItemAdded();
    onOpenChange(false);
  };

  const handleAddGoal = async () => {
    if (!goalTitle.trim()) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add goals",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        title: goalTitle,
        completed: false,
      });

    setLoading(false);

    if (error) {
      toast({
        title: "Error adding goal",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Goal added!",
      description: "Your new goal has been created.",
    });

    setGoalTitle("");
    onItemAdded();
    onOpenChange(false);
  };

  const handleAddPost = async () => {
    if (!postContent.trim()) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create posts",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        content: postContent,
        likes: 0,
      });

    setLoading(false);

    if (error) {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Post shared!",
      description: "Your post has been shared with your friends.",
    });

    setPostContent("");
    onItemAdded();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="task" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="task">Task</TabsTrigger>
            <TabsTrigger value="goal">Goal</TabsTrigger>
            <TabsTrigger value="post">Post</TabsTrigger>
          </TabsList>
          
          <TabsContent value="task" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="What needs to be done?"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-priority">Priority</Label>
              <Select value={taskPriority} onValueChange={(value: "high" | "medium" | "low") => setTaskPriority(value)}>
                <SelectTrigger id="task-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddTask} disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add Task"}
            </Button>
          </TabsContent>
          
          <TabsContent value="goal" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Goal Title</Label>
              <Input
                id="goal-title"
                placeholder="What do you want to achieve?"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
              />
            </div>
            <Button onClick={handleAddGoal} disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add Goal"}
            </Button>
          </TabsContent>
          
          <TabsContent value="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="post-content">Share your thoughts</Label>
              <Textarea
                id="post-content"
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={4}
              />
            </div>
            <Button onClick={handleAddPost} disabled={loading} className="w-full">
              {loading ? "Posting..." : "Share Post"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
