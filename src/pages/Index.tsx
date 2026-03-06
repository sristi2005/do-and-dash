import { useState } from "react";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import QuickTasks from "@/components/QuickTasks";
import TodaysGoals from "@/components/TodaysGoals";
import SocialFeed from "@/components/SocialFeed";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import AddItemDialog from "@/components/AddItemDialog";

const Index = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleItemAdded = () => {
    setRefreshKey(prev => prev + 1);
  };
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-extrabold bg-gradient-primary bg-clip-text text-transparent">
              Connect & Achieve
            </h1>
            <p className="text-sm text-muted-foreground">Let's make today amazing!</p>
          </div>
          <Avatar className="w-10 h-10 border-2 border-primary animate-pulse-glow">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
              ME
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-8 animate-fade-in">
        <QuickTasks key={`tasks-${refreshKey}`} />
        <TodaysGoals key={`goals-${refreshKey}`} />
        <SocialFeed key={`social-${refreshKey}`} />
      </main>

      {/* Floating Action Button */}
      <Button
        size="lg"
        onClick={() => setDialogOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-lift bg-gradient-primary hover:scale-110 transition-all duration-300 animate-float z-40"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddItemDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onItemAdded={handleItemAdded}
      />

      <Navigation />
    </div>
  );
};

export default Index;
