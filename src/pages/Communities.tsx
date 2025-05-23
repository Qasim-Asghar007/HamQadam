import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionContainer } from "@/components/ui/section-container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Search, Plus, ArrowRight } from "lucide-react";
import { useCommunityStore } from "@/stores/communityStore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const Communities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    area: "",
    description: "",
    image: ""
  });
  const [communityToLeave, setCommunityToLeave] = useState<string | null>(null); // State to hold the ID of the community to potentially leave

  const navigate = useNavigate();
  const {
    communities,
    addCommunity,
    joinCommunity,
    leaveCommunity
  } = useCommunityStore();

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const joinedCommunities = filteredCommunities.filter(community => community.joined);
  const discoverCommunities = filteredCommunities.filter(community => !community.joined);

  const handleCreateCommunity = () => {
    if (!newCommunity.name || !newCommunity.area || !newCommunity.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Name, Area, Description).",
        variant: "destructive",
      });
      return;
    }

    addCommunity(newCommunity);
    toast({
      title: "Success",
      description: "Community created successfully!",
    });
    setNewCommunity({
      name: "",
      area: "",
      description: "",
      image: ""
    });
    // Automatically close the dialog (if using a state-based approach for dialog)
    // or ensure DialogClose is triggered by the button within the DialogFooter
  };

  const handleJoinCommunity = (id: string) => {
    joinCommunity(id);
    toast({
      title: "Success",
      description: "You've joined the community!",
    });
  };

  const handleLeaveCommunity = () => {
    if (communityToLeave) {
      leaveCommunity(communityToLeave);
      toast({
        title: "Success",
        description: "You've left the community.",
      });
      setCommunityToLeave(null); // Reset the state
    }
  };

  return (
    <MainLayout>
      <SectionContainer>
        <SectionHeader
          title="Community Network"
          description="Join local communities in your area to connect with neighbors, share resources, and stay informed"
        />

        <div className="max-w-6xl mx-auto mb-10">
          {/* Search and Create Community */}
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search communities by name, area, or description..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary">
                  <Plus size={16} className="mr-2" />
                  Create Community
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Community</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new community network
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="community-name" className="text-sm font-medium">Community Name <span className="text-red-500">*</span></label>
                    <Input
                      id="community-name"
                      placeholder="Enter community name"
                      value={newCommunity.name}
                      onChange={(e) => setNewCommunity({...newCommunity, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="community-area" className="text-sm font-medium">Area/District <span className="text-red-500">*</span></label>
                    <Input
                      id="community-area"
                      placeholder="Enter area or district"
                      value={newCommunity.area}
                      onChange={(e) => setNewCommunity({...newCommunity, area: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="community-description" className="text-sm font-medium">Description <span className="text-red-500">*</span></label>
                    <Textarea
                      id="community-description"
                      placeholder="Describe your community"
                      value={newCommunity.description}
                      onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="community-image" className="text-sm font-medium">Image URL (optional)</label>
                    <Input
                      id="community-image"
                      placeholder="Paste image URL"
                      value={newCommunity.image}
                      onChange={(e) => setNewCommunity({...newCommunity, image: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    {/* The DialogClose asChild on the Create button will close the dialog */}
                    {/* handleCreateCommunity will be called when this button is clicked */}
                    <Button onClick={handleCreateCommunity}>Create</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Communities Tabs */}
          <Tabs defaultValue="my-communities" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="my-communities">My Communities ({joinedCommunities.length})</TabsTrigger>
              <TabsTrigger value="discover">Discover ({discoverCommunities.length})</TabsTrigger>
            </TabsList>

            {/* My Communities Tab */}
            <TabsContent value="my-communities">
              {joinedCommunities.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No communities joined yet</h3>
                  <p className="text-muted-foreground mb-6">Join communities to connect with neighbors in your area</p>
                  <Button variant="outline" onClick={() => {
                    // Programmatically switch to the "Discover" tab
                    const discoverTab = document.querySelector('[data-state="inactive"][data-value="discover"]') as HTMLElement | null;
                    discoverTab?.click();
                  }}>
                    Discover Communities
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {joinedCommunities.map(community => (
                    <Card key={community.id} className="overflow-hidden transition-all hover:shadow-md group">
                      <div className="h-32 bg-muted flex items-center justify-center relative overflow-hidden">
                        <img
                          src={community.image || "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} // Fallback in src
                          alt={`${community.name} townscape`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                             // Only update src if the error occurs and current src is not the fallback
                            const target = e.target as HTMLImageElement;
                            if (target.src !== "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80") {
                                target.src = "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                            }
                          }}
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{community.name}</CardTitle>
                          <Badge variant="outline" className="bg-primary/10 text-primary">Joined</Badge>
                        </div>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {community.area}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {community.description}
                        </p>
                        <p className="text-sm flex items-center mt-3">
                          <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">{community.members} members</span>
                        </p>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button asChild className="flex-1" variant="default">
                          <Link to={`/communities/${community.id}`} className="flex items-center justify-center">
                            View <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="px-3"
                              onClick={() => setCommunityToLeave(community.id)} // Set community to leave when dialog opens
                            >
                              Leave
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Leaving this community will remove you from its member list and you will stop receiving updates. You can rejoin anytime.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setCommunityToLeave(null)}>Cancel</AlertDialogCancel> {/* Reset state on cancel */}
                              <AlertDialogAction onClick={handleLeaveCommunity}>Leave Community</AlertDialogAction> {/* Handle leave on confirm */}
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Discover Tab */}
            <TabsContent value="discover">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {discoverCommunities.map(community => (
                  <Card key={community.id} className="overflow-hidden transition-all hover:shadow-md group">
                    <div className="h-32 bg-muted flex items-center justify-center relative overflow-hidden">
                       <img
                          src={community.image || "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} // Fallback in src
                          alt={`${community.name} townscape`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                           onError={(e) => {
                             // Only update src if the error occurs and current src is not the fallback
                            const target = e.target as HTMLImageElement;
                            if (target.src !== "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80") {
                                target.src = "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                            }
                          }}
                        />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{community.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {community.area}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {community.description}
                      </p>
                      <p className="text-sm flex items-center mt-3">
                        <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">{community.members} members</span>
                      </p>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => navigate(`/communities/${community.id}`)}
                      >
                        View Details
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => handleJoinCommunity(community.id)}
                      >
                        Join
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SectionContainer>


    </MainLayout>
  );
};

export default Communities;