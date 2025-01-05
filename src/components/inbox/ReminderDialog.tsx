import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface ReminderDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (reminder: unknown) => void;
}

const ReminderDialog = ({
  open = false,
  onOpenChange = () => {},
  onSave = () => {},
}: ReminderDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Conversation Reminder</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input placeholder="Reminder title" />
          </div>

          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea placeholder="Add notes about this reminder" />
          </div>

          <div>
            <label className="text-sm font-medium">Date & Time</label>
            <Calendar mode="single" />
            <Input type="time" className="mt-2" />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave({});
                onOpenChange(false);
              }}
            >
              Save Reminder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;
