'use client';

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // For messageText
import { PlayMessageNodeData } from '@/components/flow/nodes/PlayMessageNode';

interface PlayMessageConfigPanelProps {
  nodeData: PlayMessageNodeData & { isValid?: boolean }; // Include isValid for context
  onDataChange: (newData: Partial<PlayMessageNodeData>) => void;
}

export const PlayMessageConfigPanel: React.FC<PlayMessageConfigPanelProps> = ({ nodeData, onDataChange }) => {
  const [configError, setConfigError] = React.useState<string | null>(null);

  const validateAndSaveChanges = (field: keyof PlayMessageNodeData, value: string) => {
    const currentData = { ...nodeData, [field]: value };
    onDataChange({ [field]: value });

    const messageText = field === 'messageText' ? value : currentData.messageText;
    const audioUrl = field === 'audioUrl' ? value : currentData.audioUrl;

    if (!messageText?.trim() && !audioUrl?.trim()) {
      setConfigError('Either Message to Play (TTS) or an Audio URL must be provided.');
    } else {
      setConfigError(null);
    }
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDataChange({ label: event.target.value }); // Label change doesn't affect core validation
  };

  const handleMessageTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    validateAndSaveChanges('messageText', event.target.value);
  };

  const handleAudioUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSaveChanges('audioUrl', event.target.value);
  };

  // Effect to validate initial data
  React.useEffect(() => {
    if (!nodeData.messageText?.trim() && !nodeData.audioUrl?.trim()) {
      setConfigError('Either Message to Play (TTS) or an Audio URL must be provided.');
    } else {
      setConfigError(null);
    }
  }, [nodeData.messageText, nodeData.audioUrl]);

  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="playmessage-label" className="text-sm font-medium">
          Node Label
        </Label>
        <Input 
          id="playmessage-label" 
          name="label"
          type="text" 
          value={nodeData.label || ''} 
          onChange={handleLabelChange} 
          className="mt-1 w-full"
          placeholder="E.g., Welcome Greeting"
        />
      </div>

      <div>
        <Label htmlFor="playmessage-messagetext" className="text-sm font-medium">
          Message to Play (TTS)
        </Label>
        <Textarea 
          id="playmessage-messagetext" 
          name="messageText"
          value={nodeData.messageText || ''} 
          onChange={handleMessageTextChange} 
          className={`mt-1 w-full ${configError ? 'border-red-500' : ''}`}
          placeholder="Enter the text to be spoken..."
          rows={3}
          aria-describedby="playmessage-config-error"
        />
        <p className="text-xs text-muted-foreground mt-1">This text will be converted to speech.</p>
      </div>

      <div>
        <Label htmlFor="playmessage-audiourl" className="text-sm font-medium">
          Audio URL (Optional)
        </Label>
        <Input 
          id="playmessage-audiourl" 
          name="audioUrl"
          type="url" 
          value={nodeData.audioUrl || ''} 
          onChange={handleAudioUrlChange} 
          className={`mt-1 w-full ${configError ? 'border-red-500' : ''}`}
          placeholder="https://example.com/audio.mp3"
          aria-describedby="playmessage-config-error"
        />
        <p className="text-xs text-muted-foreground mt-1">If provided, this audio file will be played instead of TTS.</p>
      </div>
      {configError && (
        <p id="playmessage-config-error" className="text-xs text-red-600 mt-1">
          {configError}
        </p>
      )}
    </div>
  );
}; 