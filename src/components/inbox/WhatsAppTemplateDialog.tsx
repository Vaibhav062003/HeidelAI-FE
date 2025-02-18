import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WhatsAppTemplate } from "../types/template";
import { WhatsAppTemplateContent } from "./WhatsApptemplateContent";


interface WhatsAppTemplateDialogProps {
  template: WhatsAppTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSend?: () => void;
}

export const WhatsAppTemplateDialog = ({
  template,
  isOpen,
  onClose,
  onSend,
}: WhatsAppTemplateDialogProps) => {
  if (!template) return null;

  return (
    <Dialog  open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Template Preview</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <WhatsAppTemplateContent template={template} editable={true} />
        </div>
        <div className="flex justify-end mt-2">
          <Button 
            onClick={onSend} 
            className="w-full sm:w-auto bg-gray-500"
          >
            Share in Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};