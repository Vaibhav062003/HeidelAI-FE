"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import api from "@/lib/session_api"
import { useState, useEffect } from "react"

interface ConversationStatusProps {
  conversationId: string
  status?: string
}

const Conversation_Status = ({
  conversationId,
  status: initialStatus = "open",
}: ConversationStatusProps) => {
  const [status, setStatus] = useState(initialStatus)
  const { toast } = useToast()

  useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])

  const handleStatusChange = async (value: string) => {
    setStatus(value)
    console.log("🔄 Status changed to:", value)

    try {
      if (!conversationId) {
        console.warn("⚠️ No conversationId provided")
        return
      }

      if (value === "follow-up") {
        console.log("📡 Sending follow-up request...")
        const res = await api.post(`/api/ai/schedule-message/${conversationId}`)
        console.log("✅ Follow-up response:", res.status, res.data)
      } else if (value === "closed") {
        console.log("📡 Sending close request...")
        const res = await api.post(`/api/conversations/${conversationId}/close`)
        console.log("✅ Close response:", res.status, res.data)
      } else {
        console.log("ℹ️ Status is Open — no API call needed")
      }

      // Show toast success
      toast({
        title: "Status updated",
        description: `Conversation set to "${value}"`,
      })
    } catch (error) {
      console.error("❌ Failed to update status:", error)
      toast({
        title: "Error",
        description: "Failed to update conversation status",
        variant: "destructive",
      })
    }
  }

  return (
 
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full rounded-xl border-2 font-medium shadow-sm
              ${status === "open" ? "border-green-500 text-green-600" : ""}
              ${status === "follow-up" ? "border-yellow-500 text-yellow-600" : ""}
              ${status === "closed" ? "border-red-500 text-red-600" : ""}
            `}
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="open">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Open
                </span>
              </SelectItem>
              <SelectItem value="follow-up">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                  Follow-up
                </span>
              </SelectItem>
              <SelectItem value="closed">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  Closed
                </span>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

  )
}

export default Conversation_Status
