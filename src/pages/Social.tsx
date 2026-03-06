import { Search, UserPlus } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Friend {
  id: number;
  name: string;
  status: "online" | "offline";
  streak: number;
}

const Social = () => {
  const friends: Friend[] = [
    { id: 1, name: "Sarah Chen", status: "online", streak: 12 },
    { id: 2, name: "Alex Rivera", status: "online", streak: 8 },
    { id: 3, name: "Jamie Lee", status: "offline", streak: 15 },
    { id: 4, name: "Morgan Kim", status: "online", streak: 5 },
    { id: 5, name: "Taylor Swift", status: "offline", streak: 20 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-2xl font-heading font-extrabold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Friends
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              className="pl-10 bg-muted/50 border-border"
            />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 animate-fade-in">
        {/* Stories Section */}
        <div className="mb-6">
          <h2 className="text-lg font-heading font-bold mb-3">Stories</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button className="flex flex-col items-center gap-2 min-w-fit">
              <div className="w-16 h-16 rounded-full bg-gradient-primary p-0.5 animate-pulse-glow">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">Add Story</span>
            </button>

            {friends.slice(0, 5).map((friend, index) => (
              <button
                key={friend.id}
                className="flex flex-col items-center gap-2 min-w-fit animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-accent p-0.5 animate-pulse-glow">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <Avatar className="w-full h-full">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
                        {friend.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <span className="text-xs font-medium truncate w-16 text-center">
                  {friend.name.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Friends List */}
        <div className="space-y-3">
          <h2 className="text-lg font-heading font-bold">All Friends</h2>
          {friends.map((friend, index) => (
            <div
              key={friend.id}
              className="glass-card p-4 rounded-xl shadow-card card-lift animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-secondary">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
                        {friend.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background ${
                        friend.status === "online" ? "bg-accent animate-pulse-glow" : "bg-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{friend.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{friend.status}</p>
                  </div>
                </div>
                <Badge className="bg-warning/20 text-warning border-warning/50">
                  🔥 {friend.streak}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Social;
