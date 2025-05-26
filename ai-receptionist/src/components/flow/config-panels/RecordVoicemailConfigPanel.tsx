'use client';

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RecordVoicemailNodeData } from '@/components/flow/nodes/RecordVoicemailNode';

interface RecordVoicemailConfigPanelProps {
  nodeData: RecordVoicemailNodeData;
  onDataChange: (newData: Partial<RecordVoicemailNodeData>) => void;
}

export const RecordVoicemailConfigPanel: React.FC<RecordVoicemailConfigPanelProps> = ({ nodeData, onDataChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onDataChange({ [event.target.name]: event.target.value });
  };

  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="recordvoicemail-label" className="text-sm font-medium">
          Node Label
        </Label>
        <Input 
          id="recordvoicemail-label" 
          name="label"
          type="text" 
          value={nodeData.label || ''} 
          onChange={handleChange} 
          className="mt-1 w-full"
          placeholder="E.g., After Hours Voicemail"
        />
      </div>

      <div>
        <Label htmlFor="recordvoicemail-prompttext" className="text-sm font-medium">
          Voicemail Prompt (TTS)
        </Label>
        <Textarea 
          id="recordvoicemail-prompttext" 
          name="promptText"
          value={nodeData.promptText || ''} 
          onChange={handleChange} 
          className="mt-1 w-full"
          placeholder="Please leave your message after the beep..."
          rows={3}
        />
        <p className="text-xs text-muted-foreground mt-1">This text will be played before recording starts.</p>
      </div>

      <div>
        <Label htmlFor="recordvoicemail-email" className="text-sm font-medium">
          Email for Notification
        </Label>
        <Input 
          id="recordvoicemail-email" 
          name="emailForNotification"
          type="email" 
          value={nodeData.emailForNotification || ''} 
          onChange={handleChange} 
          className="mt-1 w-full"
          placeholder="you@example.com"
        />
        <p className="text-xs text-muted-foreground mt-1">The voicemail recording will be sent to this email.</p>
      </div>
    </div>
  );
}; 