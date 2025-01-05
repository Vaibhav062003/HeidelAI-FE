import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface TemplateBuilderProps {
  onSave?: (template: unknown) => void;
}

const TemplateBuilder = ({ onSave = () => {} }: TemplateBuilderProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Create Message Template</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Template Name</label>
            <Input placeholder="e.g., Order Confirmation" />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Language</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Message Type</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Message</SelectItem>
                <SelectItem value="media">Media Message</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Message Content</label>
            <Textarea
              placeholder="Enter your message content. Use {{1}}, {{2}}, etc. for variables"
              className="h-32"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Sample Values</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input placeholder="Variable {{1}}" />
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="outline" className="mt-2 w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Variable
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Template</Button>
      </div>
    </Card>
  );
};

export default TemplateBuilder;
