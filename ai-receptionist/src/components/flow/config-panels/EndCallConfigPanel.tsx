'use client';

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EndCallNodeData } from '@/components/flow/nodes/EndCallNode';

interface EndCallConfigPanelProps {
  nodeData: EndCallNodeData;
  onDataChange: (newData: Partial<EndCallNodeData>) => void;
}

export const EndCallConfigPanel: React.FC<EndCallConfigPanelProps> = ({ nodeData, onDataChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDataChange({ [event.target.name]: event.target.value });
  };

  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="endcall-label" className="text-sm font-medium">
          Node Label
        </Label>
        <Input 
          id="endcall-label" 
          name="label"
          type="text" 
          value={nodeData.label || ''} 
          onChange={handleChange} 
          className="mt-1 w-full"
          placeholder="E.g., Call Ended"
        />
      </div>
      {/* Potential future field: closingMessageText */}
    </div>
  );
}; 