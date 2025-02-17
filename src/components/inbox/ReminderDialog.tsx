import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label"
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import { Dayjs } from 'dayjs';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { toast } from "sonner";
// import { useToast } from "@/components/ui/use-toast"; 


// ... other imports

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (reminder: ReminderData) => void;
  conversationId: string; 
}

interface ReminderData {
  title: string;
  notes: string;
  dateTime: Dayjs | null;
  conversationId: string; 
}

export default function ReminderDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  conversationId 
}: ReminderDialogProps) {
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(dayjs());
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !selectedDateTime) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('https://critical-donella-egeniestores2-12e8ec2b.koyeb.app/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          notes,
          dateTime: selectedDateTime.toISOString(),
          conversationId
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to set reminder');
      }

      toast.success("Reminder set successfully", {
        description: `Reminder set for ${selectedDateTime.format('MMM D, YYYY h:mm A')}`,
      });

      onSave({
        title,
        notes,
        dateTime: selectedDateTime,
        conversationId
      });

      // Reset form
      setTitle("");
      setNotes("");
      setSelectedDateTime(dayjs());
      onOpenChange(false);

    } catch (error) {
      toast.error("Failed to set reminder", {
        description: "Please try again later",
      });
      console.log('Error setting reminder:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[1000px]"> {/* Increased max width */}
      <DialogHeader>
        <DialogTitle>Set Reminder</DialogTitle>
        <DialogDescription>
          Set a reminder for this conversation
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-6 py-4">
        {/* Left Column - Title and Notes */}
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label className="font-medium" htmlFor="title">Reminder Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter reminder title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes"
              className="min-h-[200px]" // Make textarea taller
            />
          </div>
        </div>

        {/* Right Column - Date Time Picker */}
        <div className=" px-4 ">
          <Label className="mb-2 block">Date & Time</Label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDateTimePicker
            value={selectedDateTime}
            onChange={(newValue) => setSelectedDateTime(newValue)}
            disablePast
            defaultValue={dayjs()} // Set default to current date/time
            minDateTime={dayjs()} // Prevent selecting past dates/times
            slotProps={{
              actionBar: {
                actions: [] // Remove action buttons
              },
              toolbar: {
                hidden: false // Show toolbar for better UX
              }
            }}
            className="border rounded-md bg-background"
          />
          </LocalizationProvider>
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={handleSubmit}
          disabled={!title || !notes || !selectedDateTime || isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Setting reminder..." : "Set Reminder"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  );
}