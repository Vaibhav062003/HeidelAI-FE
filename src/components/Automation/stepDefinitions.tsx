/**
 * Shared step/block definitions for Automation Builder (ManyChat-style).
 * Used by left sidebar, Add Step menu, and node labels.
 */

import React from 'react';
import {
  Zap,
  MessageSquare,
  Image as ImageIcon,
  LayoutGrid,
  Music,
  GitBranch,
  Shuffle,
  Clock,
  Tag,
  FileInput,
  Globe,
  type LucideIcon,
} from 'lucide-react';

export type StepCategory = 'trigger' | 'content' | 'logic' | 'action';

export interface StepDef {
  id: string;
  label: string;
  description: string;
  type: 'trigger' | 'action' | 'logic';
  app?: string;
  logicType?: string;
  contentKind?: 'text' | 'image' | 'card' | 'audio';
  actionType?: 'add_tag' | 'set_field' | 'api';
  triggerType?: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  pro?: boolean;
}

export const STEP_SECTIONS: { title: string; category: StepCategory; steps: StepDef[] }[] = [
  {
    title: 'Triggers',
    category: 'trigger',
    steps: [
      { id: 'trigger_comment', label: 'Comment on Post', description: 'User comments on your post or reel', type: 'trigger', triggerType: 'instagram_comment', icon: Zap, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      { id: 'trigger_keyword', label: 'Keyword in DM', description: 'Message contains a keyword', type: 'trigger', triggerType: 'keyword', icon: MessageSquare, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      { id: 'trigger_default', label: 'Default Reply', description: 'When no other trigger matches', type: 'trigger', triggerType: 'default', icon: Zap, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    ],
  },
  {
    title: 'Content',
    category: 'content',
    steps: [
      { id: 'content_text', label: 'Send Text', description: 'Send a text message', type: 'action', app: 'instagram', contentKind: 'text', icon: MessageSquare, color: 'text-purple-600', bgColor: 'bg-purple-50' },
      { id: 'content_image', label: 'Send Image', description: 'Send an image', type: 'action', app: 'instagram', contentKind: 'image', icon: ImageIcon, color: 'text-purple-600', bgColor: 'bg-purple-50' },
      { id: 'content_card', label: 'Send Card', description: 'Send a card with buttons', type: 'action', app: 'instagram', contentKind: 'card', icon: LayoutGrid, color: 'text-purple-600', bgColor: 'bg-purple-50' },
      { id: 'content_audio', label: 'Send Audio', description: 'Send an audio message', type: 'action', app: 'instagram', contentKind: 'audio', icon: Music, color: 'text-purple-600', bgColor: 'bg-purple-50' },
      { id: 'content_whatsapp', label: 'WhatsApp Message', description: 'Send WhatsApp message', type: 'action', app: 'whatsapp', contentKind: 'text', icon: MessageSquare, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    ],
  },
  {
    title: 'Logic',
    category: 'logic',
    steps: [
      { id: 'logic_actions', label: 'Actions', description: 'Perform multiple actions', type: 'logic', logicType: 'actions', icon: Zap, color: 'text-amber-600', bgColor: 'bg-amber-50', pro: false },
      { id: 'logic_condition', label: 'Condition', description: 'If/Else branch', type: 'logic', logicType: 'condition', icon: GitBranch, color: 'text-amber-600', bgColor: 'bg-amber-50', pro: true },
      { id: 'logic_randomizer', label: 'Randomizer', description: 'Random path (A/B)', type: 'logic', logicType: 'randomizer', icon: Shuffle, color: 'text-amber-600', bgColor: 'bg-amber-50', pro: true },
      { id: 'logic_delay', label: 'Smart Delay', description: 'Wait before next step', type: 'logic', logicType: 'delay', icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50', pro: true },
    ],
  },
  {
    title: 'Actions',
    category: 'action',
    steps: [
      { id: 'action_tag', label: 'Add Tag', description: 'Add tag to contact', type: 'action', actionType: 'add_tag', icon: Tag, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
      { id: 'action_field', label: 'Set Custom Field', description: 'Set a user field', type: 'action', actionType: 'set_field', icon: FileInput, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
      { id: 'action_api', label: 'HTTP Request', description: 'Call external API (webhook)', type: 'action', actionType: 'api', icon: Globe, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    ],
  },
];

// Flatten for lookup by id
export const STEP_BY_ID: Record<string, StepDef> = {};
STEP_SECTIONS.forEach((section) => {
  section.steps.forEach((s) => {
    STEP_BY_ID[s.id] = s;
  });
});

export function StepIcon({ step, size = 'w-5 h-5' }: { step: StepDef; size?: string }) {
  const Icon = step.icon;
  return <Icon className={`${size} ${step.color}`} />;
}
