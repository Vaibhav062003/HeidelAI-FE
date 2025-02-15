import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WhatsAppTemplate } from '../types/template';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';


interface TemplatePreProps {
  template: WhatsAppTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

const TemplatePre = ({ template, isOpen, onClose }: TemplatePreProps) => {
  if (!template) return null;

  const renderHeader = (component: any) => {
    switch (component.type) {
      case 'TEXT':
        return <div className="text-sm font-medium mb-2">{component.text}</div>;
      case 'MEDIA':
        return (
          <div className="bg-gray-100 rounded-lg p-4 mb-2 text-center text-sm text-gray-600">
            [Media Content]
          </div>
        );
      case 'LOCATION':
        return (
          <div className="bg-gray-100 rounded-lg p-4 mb-2 text-center text-sm text-gray-600">
            [Location]
          </div>
        );
      default:
        return null;
    }
  };

  const renderBody = (component: any) => {
    if (component.type !== 'BODY') return null;

    let text = component.text;
    if (component.example?.body_text?.[0]) {
      component.example.body_text[0].forEach((value: string, index: number) => {
        text = text.replace(`{{${index + 1}}}`, value);
      });
    }
    return <div className="text-sm mb-4">{text}</div>;
  };

  const renderFooter = (component: any) => {
    if (component.type !== 'FOOTER') return null;
    return <div className="text-xs text-gray-500 mt-2">{component.text}</div>;
  };

  const renderButtons = (component: any) => {
    if (component.type !== 'BUTTONS') return null;
    return (
      <div className="mt-4 space-y-2">
        {component.buttons.map((button: any, index: number) => (
          <button
            key={index}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
          >
            {button.text}
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{template.name}</span>
            <Badge variant="outline">{template.category}</Badge>
          </DialogTitle>
          <h1>Template Preview</h1>
        </DialogHeader>
        <div className="mt-4 ">
          <Card className="p-4 bg-gray-50">
            <div className="max-w-[320px] mx-auto bg-green-300 rounded-lg shadow-sm p-4">
              {template.components?.map((component, index) => (
                <div key={index}>
                  {renderHeader(component)}
                  {renderBody(component)}
                  {renderFooter(component)}
                  {renderButtons(component)}
                </div>
              ))}
            </div>
          </Card>
          <div className="mt-4 flex justify-center">
            <Button onClick={onClose}  className="mr-2">
              <Send className="mr-2" size={20} />
              Send In Chat
            </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePre;