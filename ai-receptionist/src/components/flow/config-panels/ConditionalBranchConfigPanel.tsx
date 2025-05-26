'use client';

import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2Icon, PlusCircleIcon } from 'lucide-react';
import { ConditionalBranchNodeData, ConditionBranch } from '@/components/flow/nodes/ConditionalBranchNode';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // For operator

interface ConditionalBranchConfigPanelProps {
  nodeData: ConditionalBranchNodeData;
  onDataChange: (newData: Partial<ConditionalBranchNodeData>) => void;
}

let conditionIdCounter = 0;
const getNewConditionId = () => `cond_branch_${Date.now()}_${conditionIdCounter++}`;

const availableOperators = ['==', '!=', '>', '<', '>=', '<=', 'contains', 'startsWith', 'endsWith'];

export const ConditionalBranchConfigPanel: React.FC<ConditionalBranchConfigPanelProps> = ({ nodeData, onDataChange }) => {
  const [internalConditions, setInternalConditions] = useState<ConditionBranch[]>(nodeData.conditions || []);

  useEffect(() => {
    setInternalConditions(nodeData.conditions || []);
  }, [nodeData.conditions]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDataChange({ [event.target.name]: event.target.value });
  };

  const handleConditionChange = (index: number, field: keyof ConditionBranch, value: any) => {
    const updatedConditions = internalConditions.map((cond, i) => 
      i === index ? { ...cond, [field]: value } : cond
    );
    setInternalConditions(updatedConditions);
    onDataChange({ conditions: updatedConditions });
  };

  const addCondition = () => {
    const newCondition: ConditionBranch = {
      id: getNewConditionId(),
      variable: '',
      operator: '==',
      value: '',
      label: '',
    };
    const updatedConditions = [...internalConditions, newCondition];
    setInternalConditions(updatedConditions);
    onDataChange({ conditions: updatedConditions });
  };

  const removeCondition = (index: number) => {
    const updatedConditions = internalConditions.filter((_, i) => i !== index);
    setInternalConditions(updatedConditions);
    onDataChange({ conditions: updatedConditions });
  };

  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="condbranch-label">Node Label</Label>
        <Input id="condbranch-label" name="label" value={nodeData.label || ''} onChange={handleInputChange} placeholder="E.g., Check Caller Type" />
      </div>
      
      <Label>Conditions (Evaluated in order)</Label>
      {internalConditions.map((condition, index) => (
        <Card key={condition.id || index} className="p-3 space-y-3 bg-muted/50 relative">
            <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeCondition(index)}>
                <Trash2Icon size={14} />
            </Button>
          <div>
            <Label htmlFor={`cond-variable-${index}`} className="text-xs">Variable</Label>
            <Input id={`cond-variable-${index}`} value={condition.variable} onChange={(e) => handleConditionChange(index, 'variable', e.target.value)} placeholder="E.g., call.callerId" />
          </div>
          <div className="grid grid-cols-2 gap-2 items-end">
            <div>
              <Label htmlFor={`cond-operator-${index}`} className="text-xs">Operator</Label>
              <Select 
                value={condition.operator} 
                onValueChange={(val: string) => handleConditionChange(index, 'operator', val)}
              >
                <SelectTrigger id={`cond-operator-${index}`}><SelectValue placeholder="Select operator" /></SelectTrigger>
                <SelectContent>
                  {availableOperators.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor={`cond-value-${index}`} className="text-xs">Value</Label>
              <Input id={`cond-value-${index}`} value={condition.value} onChange={(e) => handleConditionChange(index, 'value', e.target.value)} placeholder="E.g., '5551234' or 100" />
            </div>
          </div>
          <div>
            <Label htmlFor={`cond-label-${index}`} className="text-xs">Handle Label</Label>
            <Input id={`cond-label-${index}`} value={condition.label} onChange={(e) => handleConditionChange(index, 'label', e.target.value)} placeholder="E.g., If VIP Caller" />
          </div>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={addCondition} className="w-full">
        <PlusCircleIcon size={16} className="mr-2" /> Add Condition
      </Button>

      <div>
        <Label htmlFor="condbranch-elselabel">'Else' Handle Label</Label>
        <Input id="condbranch-elselabel" name="elseHandleLabel" value={nodeData.elseHandleLabel || ''} onChange={handleInputChange} placeholder="E.g., Else / Default" />
      </div>

    </div>
  );
}; 