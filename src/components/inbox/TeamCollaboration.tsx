import React from "react";
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

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "busy" | "away" | "offline";
  currentTask?: string;
  activeTime?: string;
  expertise: string[];
}

interface TeamCollaborationProps {
  activeTeam?: TeamMember[];
  onTransferChat?: (agentId: string) => void;
  onRequestHelp?: (agentId: string) => void;
}

const TeamCollaboration = ({
  activeTeam = [
    {
      id: "1",
      name: "Sarah Miller",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      status: "online",
      currentTask: "Handling technical support",
      activeTime: "2h 15m",
      expertise: ["Technical", "Product"],
    },
    {
      id: "2",
      name: "John Davis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      status: "busy",
      currentTask: "Customer escalation",
      activeTime: "45m",
      expertise: ["Billing", "Support"],
    },
  ],
  onTransferChat = () => {},
  onRequestHelp = () => {},
}: TeamCollaborationProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "busy":
        return "bg-red-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <TooltipProvider>
      <Card className="p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Team Collaboration</h3>
          </div>
          <Badge variant="secondary">{activeTeam.length} Active</Badge>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {activeTeam.map((member) => (
              <Card key={member.id} className="p-3">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <img src={member.avatar} alt={member.name} />
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(
                        member.status,
                      )}`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{member.name}</h4>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {member.activeTime}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                      {member.currentTask}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {member.expertise.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => onTransferChat(member.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Transfer
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Transfer chat to {member.name}
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => onRequestHelp(member.id)}
                          >
                            <HandIcon className="h-4 w-4 mr-2" />
                            Request Help
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Request assistance from {member.name}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

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
