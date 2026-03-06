import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: string;
  user_id: string;
  content: string;
  likes: number;
  created_at: string;
  profiles?: {
    username: string | null;
  };
  liked?: boolean;
}

const SocialFeed = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const fetchPosts = async () => {
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select(`
        *,
        profiles(username)
      `)
      .order('created_at', { ascending: false });

    if (postsError) {
      toast({
        title: "Error loading posts",
        description: postsError.message,
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: likesData } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id);

    const likedPostIds = new Set(likesData?.map(l => l.post_id) || []);

    setPosts(postsData?.map(post => ({
      ...post,
      liked: likedPostIds.has(post.id)
    })) || []);
  };

  const toggleLike = async (postId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.liked) {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error removing like",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      await supabase
        .from('posts')
        .update({ likes: Math.max(0, post.likes - 1) })
        .eq('id', postId);
    } else {
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });

      if (error) {
        toast({
          title: "Error adding like",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      await supabase
        .from('posts')
        .update({ likes: post.likes + 1 })
        .eq('id', postId);
    }

    fetchPosts();
  };

  const handleComment = () => {
    toast({
      title: "Coming soon!",
      description: "Comment functionality will be available soon.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Coming soon!",
      description: "Share functionality will be available soon.",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-warning animate-pulse-glow" />
        <h2 className="text-xl font-heading font-bold">Friend Activity</h2>
      </div>

      {posts.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl text-center">
          <p className="text-muted-foreground">No posts yet. Share your achievements to inspire others!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, index) => {
            const author = post.profiles?.username || 'Anonymous';
            const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
            
            return (
              <div
                key={post.id}
                className="glass-card p-4 rounded-2xl shadow-card card-lift animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 border-2 border-secondary">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                      {author.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{author}</h3>
                      <span className="text-xs text-muted-foreground">{timeAgo}</span>
                    </div>
                    <p className="text-sm text-foreground/90 mb-3">{post.content}</p>
                    
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className={cn(
                          "flex items-center gap-1 transition-colors group",
                          post.liked ? "text-primary" : "hover:text-primary"
                        )}
                      >
                        <Heart className={cn(
                          "h-4 w-4 group-hover:scale-110 transition-transform",
                          post.liked && "fill-current"
                        )} />
                        <span className="text-xs">{post.likes}</span>
                      </button>
                      <button 
                        onClick={handleComment}
                        className="flex items-center gap-1 hover:text-accent transition-colors group"
                      >
                        <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span className="text-xs">0</span>
                      </button>
                      <button 
                        onClick={handleShare}
                        className="flex items-center gap-1 hover:text-secondary transition-colors group"
                      >
                        <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
