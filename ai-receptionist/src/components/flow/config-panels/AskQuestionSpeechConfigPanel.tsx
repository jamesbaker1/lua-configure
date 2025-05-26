'use client';

import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2Icon, PlusCircleIcon } from 'lucide-react';
import { AskQuestionSpeechNodeData, SpeechIntentBranch } from '@/components/flow/nodes/AskQuestionSpeechNode';
import { Card } from '@/components/ui/card';

interface AskQuestionSpeechConfigPanelProps {
  nodeData: AskQuestionSpeechNodeData;
  onDataChange: (newData: Partial<AskQuestionSpeechNodeData>) => void;
}

let intentBranchIdCounter = 0;
const getNewIntentBranchId = () => `intent_branch_${Date.now()}_${intentBranchIdCounter++}`;

export const AskQuestionSpeechConfigPanel: React.FC<AskQuestionSpeechConfigPanelProps> = ({ nodeData, onDataChange }) => {
  const [internalIntents, setInternalIntents] = useState<SpeechIntentBranch[]>(nodeData.expectedIntents || []);

  useEffect(() => {
    setInternalIntents(nodeData.expectedIntents || []);
  }, [nodeData.expectedIntents]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onDataChange({ [event.target.name]: event.target.value });
  };

  const handleNumericInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const name = event.target.name;
    onDataChange({ [name]: value === '' ? undefined : (name === 'confidenceThreshold' ? parseFloat(value) : parseInt(value, 10)) });
  };

  const handleIntentChange = (index: number, field: keyof SpeechIntentBranch, value: string) => {
    const updatedIntents = internalIntents.map((intent, i) => {
      if (i === index) {
        if (field === 'keywords') {
          return { ...intent, [field]: value.split(',').map(kw => kw.trim()).filter(kw => kw !== '') };
        }
        return { ...intent, [field]: value };
      }
      return intent;
    });
    setInternalIntents(updatedIntents);
    onDataChange({ expectedIntents: updatedIntents });
  };

  const addIntent = () => {
    const newIntent: SpeechIntentBranch = {
      id: getNewIntentBranchId(),
      intentName: '',
      keywords: [],
      label: '',
    };
    const updatedIntents = [...internalIntents, newIntent];
    setInternalIntents(updatedIntents);
    onDataChange({ expectedIntents: updatedIntents });
  };

  const removeIntent = (index: number) => {
    const updatedIntents = internalIntents.filter((_, i) => i !== index);
    setInternalIntents(updatedIntents);
    onDataChange({ expectedIntents: updatedIntents });
  };

  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="askspeech-label">Node Label</Label>
        <Input id="askspeech-label" name="label" value={nodeData.label || ''} onChange={handleInputChange} placeholder="E.g., Voice Command" />
      </div>

      <div>
        <Label htmlFor="askspeech-questiontext">Question Text (TTS)</Label>
        <Textarea id="askspeech-questiontext" name="questionText" value={nodeData.questionText || ''} onChange={handleInputChange} placeholder="E.g., How can I help you today?" rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="askspeech-timeout">Timeout (seconds, Optional)</Label>
          <Input id="askspeech-timeout" name="timeoutSeconds" type="number" value={nodeData.timeoutSeconds || ''} onChange={handleNumericInputChange} placeholder="E.g., 10" />
        </div>
        <div>
          <Label htmlFor="askspeech-confidence">Confidence Threshold (0.0-1.0, Opt.)</Label>
          <Input id="askspeech-confidence" name="confidenceThreshold" type="number" step="0.1" min="0" max="1" value={nodeData.confidenceThreshold || ''} onChange={handleNumericInputChange} placeholder="E.g., 0.7" />
        </div>
      </div>
      
      <Label>Speech Intents</Label>
      {internalIntents.map((intent, index) => (
        <Card key={intent.id || index} className="p-3 space-y-2 bg-muted/50 relative">
            <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeIntent(index)}>
                <Trash2Icon size={14} />
            </Button>
          <div>
            <Label htmlFor={`intent-name-${index}`} className="text-xs">Intent Name</Label>
            <Input id={`intent-name-${index}`} value={intent.intentName} onChange={(e) => handleIntentChange(index, 'intentName', e.target.value)} placeholder="E.g., SalesInquiry" />
          </div>
          <div>
            <Label htmlFor={`intent-keywords-${index}`} className="text-xs">Keywords (comma-separated)</Label>
            <Input id={`intent-keywords-${index}`} value={intent.keywords.join(', ')} onChange={(e) => handleIntentChange(index, 'keywords', e.target.value)} placeholder="E.g., price, quote, cost" />
          </div>
          <div>
            <Label htmlFor={`intent-label-${index}`} className="text-xs">Handle Label</Label>
            <Input id={`intent-label-${index}`} value={intent.label} onChange={(e) => handleIntentChange(index, 'label', e.target.value)} placeholder="E.g., Intent: Sales" />
          </div>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={addIntent} className="w-full">
        <PlusCircleIcon size={16} className="mr-2" /> Add Speech Intent
      </Button>

      <div>
        <Label htmlFor="askspeech-fallbacklabel">'Fallback/No Match' Handle Label</Label>
        <Input id="askspeech-fallbacklabel" name="fallbackHandleLabel" value={nodeData.fallbackHandleLabel || ''} onChange={handleInputChange} placeholder="E.g., Could not understand" />
      </div>

    </div>
  );
}; 