'use client';

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClioLogCallNodeData } from '@/components/flow/nodes/ClioLogCallNode';

interface ClioLogCallConfigPanelProps {
  nodeData: ClioLogCallNodeData;
  onDataChange: (newData: Partial<ClioLogCallNodeData>) => void;
}

export const ClioLogCallConfigPanel: React.FC<ClioLogCallConfigPanelProps> = ({ nodeData, onDataChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onDataChange({ [event.target.name]: event.target.value });
  };

  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="clio-logcall-label" className="text-sm font-medium">
          Node Label
        </Label>
        <Input 
          id="clio-logcall-label" 
          name="label"
          type="text" 
          value={nodeData.label || ''} 
          onChange={handleChange} 
          className="mt-1 w-full"
          placeholder="E.g., Log Call to Clio"
        />
      </div>

      <div>
        <Label htmlFor="clio-logcall-matterrule" className="text-sm font-medium">
          Matter Lookup Rule
        </Label>
        <Input 
          id="clio-logcall-matterrule" 
          name="matterLookupRule"
          type="text" 
          value={nodeData.matterLookupRule || ''} 
          onChange={handleChange} 
          className="mt-1 w-full"
          placeholder="E.g., caller_id_match or input.matter_id"
        />
        <p className="text-xs text-muted-foreground mt-1">Define how to find the Clio Matter (e.g., by caller ID, a variable).</p>
      </div>

      <div>
        <Label htmlFor="clio-logcall-notes" className="text-sm font-medium">
          Log Notes
        </Label>
        <Textarea 
          id="clio-logcall-notes" 
          name="logNotes"
          value={nodeData.logNotes || ''} 
          onChange={handleChange} 
          className="mt-1 w-full"
          placeholder="Details of the call, e.g., discussed XYZ, outcome was ABC..."
          rows={4}
        />
      </div>
    </div>
  );
}; 