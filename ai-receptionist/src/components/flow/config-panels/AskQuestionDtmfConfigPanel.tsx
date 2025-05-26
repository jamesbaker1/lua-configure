'use client';

import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2Icon, PlusCircleIcon } from 'lucide-react';
import { AskQuestionDtmfNodeData, DtmfBranch } from '@/components/flow/nodes/AskQuestionDtmfNode';
import { Card } from '@/components/ui/card'; // Removed CardContent, CardHeader, CardTitle

interface AskQuestionDtmfConfigPanelProps {
  nodeData: AskQuestionDtmfNodeData;
  onDataChange: (newData: Partial<AskQuestionDtmfNodeData>) => void;
}

let branchIdCounter = 0;
const getNewBranchId = () => `branch_${Date.now()}_${branchIdCounter++}`;

export const AskQuestionDtmfConfigPanel: React.FC<AskQuestionDtmfConfigPanelProps> = ({ nodeData, onDataChange }) => {
  // Local state for branches to manage additions/deletions before committing to parent
  const [internalBranches, setInternalBranches] = useState<DtmfBranch[]>(nodeData.branches || []);

  useEffect(() => {
    // Sync internal branches with prop if nodeData changes from outside (e.g., undo/redo, node selection)
    setInternalBranches(nodeData.branches || []);
  }, [nodeData.branches]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onDataChange({ [event.target.name]: event.target.value });
  };

  const handleNumericInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onDataChange({ [event.target.name]: value === '' ? undefined : parseInt(value, 10) });
  };

  const handleBranchChange = (index: number, field: keyof DtmfBranch, value: string) => {
    const updatedBranches = internalBranches.map((branch, i) => 
      i === index ? { ...branch, [field]: value } : branch
    );
    setInternalBranches(updatedBranches);
    onDataChange({ branches: updatedBranches }); // Update parent immediately for now
  };

  const addBranch = () => {
    const newBranch: DtmfBranch = {
      id: getNewBranchId(), // Ensure unique ID for React key and handle ID
      digitPattern: '',
      label: '',
    };
    const updatedBranches = [...internalBranches, newBranch];
    setInternalBranches(updatedBranches);
    onDataChange({ branches: updatedBranches });
  };

  const removeBranch = (index: number) => {
    const updatedBranches = internalBranches.filter((_, i) => i !== index);
    setInternalBranches(updatedBranches);
    onDataChange({ branches: updatedBranches });
  };

  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="askdtmf-label">Node Label</Label>
        <Input id="askdtmf-label" name="label" value={nodeData.label || ''} onChange={handleInputChange} placeholder="E.g., Main Menu Choice" />
      </div>

      <div>
        <Label htmlFor="askdtmf-questiontext">Question Text (TTS)</Label>
        <Textarea id="askdtmf-questiontext" name="questionText" value={nodeData.questionText || ''} onChange={handleInputChange} placeholder="E.g., Press 1 for sales, 2 for support..." rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="askdtmf-expecteddigits">Expected Digits (Optional)</Label>
          <Input id="askdtmf-expecteddigits" name="expectedDigits" type="number" value={nodeData.expectedDigits || ''} onChange={handleNumericInputChange} placeholder="E.g., 1" />
        </div>
        <div>
          <Label htmlFor="askdtmf-timeout">Timeout (seconds, Optional)</Label>
          <Input id="askdtmf-timeout" name="timeoutSeconds" type="number" value={nodeData.timeoutSeconds || ''} onChange={handleNumericInputChange} placeholder="E.g., 10" />
        </div>
      </div>
      
      <Label>DTMF Branches (Keypad Options)</Label>
      {internalBranches.map((branch, index) => (
        <Card key={branch.id || index} className="p-3 space-y-2 bg-muted/50 relative">
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1 right-1 h-6 w-6" 
                onClick={() => removeBranch(index)}
            >
                <Trash2Icon size={14} />
            </Button>
          <div className="grid grid-cols-2 gap-2 items-end">
            <div>
              <Label htmlFor={`branch-pattern-${index}`} className="text-xs">Digit(s)</Label>
              <Input id={`branch-pattern-${index}`} value={branch.digitPattern} onChange={(e) => handleBranchChange(index, 'digitPattern', e.target.value)} placeholder="E.g., 1 or *" />
            </div>
            <div>
              <Label htmlFor={`branch-label-${index}`} className="text-xs">Handle Label</Label>
              <Input id={`branch-label-${index}`} value={branch.label} onChange={(e) => handleBranchChange(index, 'label', e.target.value)} placeholder="E.g., On &apos;1&apos; (Sales)" />
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={addBranch} className="w-full">
        <PlusCircleIcon size={16} className="mr-2" /> Add Keypad Option
      </Button>

      <div>
        <Label htmlFor="askdtmf-nomatchlabel">No Match/Timeout Handle Label</Label>
        <Input id="askdtmf-nomatchlabel" name="noMatchHandleLabel" value={nodeData.noMatchHandleLabel || ''} onChange={handleInputChange} placeholder="E.g., Invalid input / Timeout" />
      </div>

    </div>
  );
}; 