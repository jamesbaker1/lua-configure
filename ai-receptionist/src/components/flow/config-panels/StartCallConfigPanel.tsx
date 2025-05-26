'use client';

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StartCallNodeData } from '@/components/flow/nodes/StartCallNode'; // Import the data type

interface StartCallConfigPanelProps {
  nodeData: StartCallNodeData;
  onDataChange: (newData: Partial<StartCallNodeData>) => void;
}

export const StartCallConfigPanel: React.FC<StartCallConfigPanelProps> = ({ nodeData, onDataChange }) => {
  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDataChange({ label: event.target.value });
  };

  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="startcall-label" className="text-sm font-medium">
          Node Label
        </Label>
        <Input 
          id="startcall-label" 
          type="text" 
          value={nodeData.label || ''} 
          onChange={handleLabelChange} 
          className="mt-1 w-full"
          placeholder="Enter node label"
        />
        <p className="text-xs text-muted-foreground mt-1">The display name for this start node.</p>
      </div>
      {/* Add more configuration options for StartCallNodeData here if needed */}
    </div>
  );
}; 