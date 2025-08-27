import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, Instagram } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import api from '@/lib/session_api';

interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption: string;
  media_type: string;
  thumbnail_url?: string;
  timestamp: string;
}

interface InstagramProfile {
  username: string;
  name: string;
  biography: string;
  profile_picture_url: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  website?: string;
}

interface InstagramProfileViewProps {
  instagramId: string;
  onClose: () => void;
  isOpen: boolean;
}

const InstagramProfileView = ({ instagramId, onClose, isOpen }: InstagramProfileViewProps) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  useEffect(() => {
    if (isOpen && instagramId) {
      fetchProfileAndPosts();
    }
  }, [isOpen, instagramId]);

  const fetchProfileAndPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch profile data
      const profileResponse = await api.get(`/api/instagram/${instagramId}/profile`);
      
      if (profileResponse.status !== 200){
        throw new Error(`Failed to fetch Instagram profile: ${profileResponse.statusText || profileResponse.status}`);
      }
  
      const profileData = await profileResponse.data();
      setProfile(profileData.data);
      
      // Fetch posts
      const postsResponse = await api.get(`/api/instagram/${instagramId}/posts?limit=24`);
      if (postsResponse.status !== 200) {
        throw new Error(`Failed to fetch Instagram posts: ${postsResponse.statusText || postsResponse.status}`);
      }
      const postsData = await postsResponse.data();
      setPosts(postsData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching Instagram data:', err);
      toast({
        variant: "destructive",
        title: "Error loading Instagram data",
        description: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className='text-black'>Instagram Profile</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchProfileAndPosts}>Retry</Button>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-4">
              {/* Profile Header */}
              {profile && (
                <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                  <Avatar className="h-24 w-24 border-2 border-purple-200">
                    <AvatarImage src={profile.profile_picture_url} alt={profile.username} />
                    <AvatarFallback>{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl text-black font-bold">{profile.username}</h2>
                    <p className='text-black'>{profile.name}</p>
                    <p className="text-sm text-gray-600">{profile.biography}</p>
                    
                    {profile.website && (
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                      >
                        {profile.website} <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    
                    <div className="flex gap-6 mt-2">
                      <div className="text-center">
                        <p className="font-bold text-black">{profile.media_count}</p>
                        <p className="text-xs text-gray-600">Posts</p>
                      </div>
                      <div className="text-center text-black">
                        <p className="font-bold">{profile.followers_count}</p>
                        <p className="text-xs text-gray-600">Followers</p>
                      </div>
                      <div className="text-center text-black">
                        <p className="font-bold">{profile.follows_count}</p>
                        <p className="text-xs text-gray-600">Following</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Posts Grid */}
              <div className={`
                ${posts.length === 0 ? 'hidden' : 
                posts.length === 1 ? 'flex justify-center' : 
                posts.length === 2 ? 'grid grid-cols-2 gap-4' : 
                'grid grid-cols-2 md:grid-cols-3 gap-2'}
              `}>
                {posts.length === 0 && (
                  <div className="text-center py-8 w-full">
                    <p className="text-gray-500">No posts to display</p>
                  </div>
                )}
                
                {posts.length === 1 && (
                  // For a single post, display it larger and centered
                  <div 
                    className="relative rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-all max-w-xl w-full"
                    onClick={() => setSelectedPost(posts[0])}
                  >
                    <img 
                      src={posts[0].media_type === 'VIDEO' ? posts[0].thumbnail_url || posts[0].media_url : posts[0].media_url} 
                      alt={posts[0].caption || 'Instagram post'}
                      className="w-full object-cover rounded-md"
                      style={{ maxHeight: '60vh' }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium">View Post</span>
                    </div>
                    
                    {posts[0].media_type === 'VIDEO' && (
                      <Badge className="absolute top-2 right-2 bg-black/70" variant="secondary">
                        VIDEO
                      </Badge>
                    )}
                    
                    {posts[0].media_type === 'CAROUSEL_ALBUM' && (
                      <Badge className="absolute top-2 right-2 bg-black/70" variant="secondary">
                        ALBUM
                      </Badge>
                    )}
                  </div>
                )}
                
                {posts.length >= 2 && posts.map((post) => (
                  <div 
                    key={post.id} 
                    className={`relative aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-all ${posts.length === 2 ? 'max-w-md' : ''}`}
                    onClick={() => setSelectedPost(post)}
                  >
                    <img 
                      src={post.media_type === 'VIDEO' ? post.thumbnail_url || post.media_url : post.media_url} 
                      alt={post.caption || 'Instagram post'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium">View Post</span>
                    </div>
                    
                    {post.media_type === 'VIDEO' && (
                      <Badge className="absolute top-2 right-2 bg-black/70" variant="secondary">
                        VIDEO
                      </Badge>
                    )}
                    
                    {post.media_type === 'CAROUSEL_ALBUM' && (
                      <Badge className="absolute top-2 right-2 bg-black/70" variant="secondary">
                        ALBUM
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              {/*  if no posts available  */}
              {!loading && !error && posts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
      
      {/* Post Detail Dialog */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
          <DialogContent className="max-w-5xl p-0 overflow-hidden">
            <div className="flex flex-col md:flex-row h-[80vh]">
              <div className="flex-1 bg-black flex items-center justify-center">
                {selectedPost.media_type === 'VIDEO' ? (
                  <video 
                    src={selectedPost.media_url} 
                    controls 
                    className="max-h-full max-w-full" 
                  />
                ) : (
                  <img 
                    src={selectedPost.media_url} 
                    alt={selectedPost.caption || 'Instagram post'} 
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
              
              <div className="w-full md:w-[350px] p-4">
                <ScrollArea className="h-[calc(80vh-2rem)]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.profile_picture_url} />
                        <AvatarFallback>{profile?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{profile?.username}</span>
                    </div>
                    
                    {selectedPost.caption && (
                      <p className="text-sm">{selectedPost.caption}</p>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      {new Date(selectedPost.timestamp).toLocaleDateString()}
                    </p>
                    
                    <Button 
                      asChild
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-500"
                    >
                      <a href={selectedPost.permalink} target="_blank" rel="noopener noreferrer" className="flex gap-2 items-center">
                        <Instagram className="h-4 w-4" />
                        View on Instagram
                      </a>
                    </Button>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default InstagramProfileView;