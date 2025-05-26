'use client';

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClioCreateTaskNodeData } from '@/components/flow/nodes/ClioCreateTaskNode';

interface ClioCreateTaskConfigPanelProps {
  nodeData: ClioCreateTaskNodeData;
  onDataChange: (newData: Partial<ClioCreateTaskNodeData>) => void;
}

export const ClioCreateTaskConfigPanel: React.FC<ClioCreateTaskConfigPanelProps> = ({ nodeData, onDataChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onDataChange({ [event.target.name]: event.target.value });
  };

  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="clio-createtask-label" className="text-sm font-medium">
          Node Label
        </Label>
        <Input 
          id="clio-createtask-label" 
          name="label"
          type="text" 
          value={nodeData.label || ''} 
          onChange={handleChange} 
          className="mt-1 w-full"
          placeholder="E.g., Create Follow-up Task"
        />
      </div>

      <div>
        <Label htmlFor="clio-createtask-title" className="text-sm font-medium">
          Task Title
        </Label>
        <Input 
          id="clio-createtask-title" 
          name="taskTitle"
          type="text" 
          value={nodeData.taskTitle || ''} 
          onChange={handleChange} 
          className="mt-1 w-full"
          placeholder="Follow up with caller"
        />
      </div>

      <div>
        <Label htmlFor="clio-createtask-description" className="text-sm font-medium">
          Task Description
        </Label>
        <Textarea 
          id="clio-createtask-description" 
          name="taskDescription"
          value={nodeData.taskDescription || ''} 
          onChange={handleChange} 
          className="mt-1 w-full"
          placeholder="Caller requested a callback regarding case XYZ..."
          rows={4}
        />
      </div>
    </div>
  );
}; 