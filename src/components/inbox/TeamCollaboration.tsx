import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Users, MessageSquare, HandIcon, Coffee, Clock } from "lucide-react";
import { getFirestore, collection, getDocs, doc, setDoc, onSnapshot } from "firebase/firestore";
import { app } from "@/components/firebase"; // Your Firebase configuration
import { userId } from "@/app/login/page";

interface TeamMember {
  id: string;
  name?: string;
  photoURL?: string;
  status?: "online" | "offline";
  currentTask?: string;
  activeTime?: string;
  expertise?: string[];
}

const TeamCollaboration = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const db = getFirestore(app);
        const usersCollection = collection(db, "users");
        const userDocs = await getDocs(usersCollection);
        const users = userDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched Users:", users);
        setTeamMembers(users as TeamMember[]); // Type assertion for TeamMember[]
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
    }
  };

  const sendHelpRequest = async (teamMemberId: string, requesterName: string) => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", teamMemberId);
    await setDoc(userRef, { helpRequested: true, requesterName }, { merge: true });
  };

  const listenForHelpRequests = (teamMemberId: string) => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", teamMemberId);
    onSnapshot(userRef, (docSnapshot) => {
      const data = docSnapshot.data();
      if (data?.helpRequested) {
        setNotification(`Help requested by ${data.requesterName}`);
      }
    });
  };


  useEffect(() => {
    // Assuming you want to listen for requests for the current user:
    // Replace 'currentUserId' with actual ID of the current user.
    const currentUserId = "NPKxtXJ9D3TRGHV4njIyeaaRFvr1"; // This should be dynamically set
    listenForHelpRequests(currentUserId);
  }, []);

  return (
    <TooltipProvider>
      <Card className="p-5 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Team Collaboration</h3>
          </div>
          <Badge variant="secondary">{teamMembers?.length || 0} Members</Badge>
        </div>

        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {Array.isArray(teamMembers) && teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <Card key={member.id} className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <img
                          src={member.photoURL || "/default-avatar.png"}
                          alt={member.name || "Unnamed"}
                        />
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(
                          member.status
                        )}`}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{member.name || "Unknown"}</h4>
                        {member.activeTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">{member.activeTime}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mt-1">{member.currentTask || "No task assigned"}</p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.expertise?.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <div className="flex justify-center items-center mt-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center justify-center px-6 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
                                onClick={() => sendHelpRequest(member.id, "Current User")} // Replace with actual current user name
                              >
                                <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                                Transfer
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Transfer chat to {member.name || "Unknown"}</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p>No team members available.</p>
            )}
          </div>
        </ScrollArea>

        {notification && (
          <div className="mt-4 p-4 bg-yellow-300 text-black rounded-md">
            {notification}
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            <Coffee className="h-4 w-4 mr-2" />
            Take a Break
          </Button>
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default TeamCollaboration;
