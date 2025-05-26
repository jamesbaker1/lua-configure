'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageCircleIcon, PlayCircleIcon } from 'lucide-react';

export type PlayMessageNodeData = {
  label: string;
  messageText?: string; // For TTS
  audioUrl?: string;    // For pre-recorded audio
};

export function PlayMessageNode({ data, selected }: NodeProps<Node<PlayMessageNodeData & { isValid?: boolean }>>) {
  const hasMessageText = !!data.messageText?.trim();
  const hasAudioUrl = !!data.audioUrl?.trim();
  let displayText = 'Not configured';
  if (hasMessageText) {
    displayText = `TTS: ${data.messageText}`;
  } else if (hasAudioUrl && data.audioUrl) {
    displayText = `Audio: ${data.audioUrl.split('/').pop() || data.audioUrl}`;
  }

  const borderColorClass = data.isValid === false ? 'border-red-500' : 'border-blue-500';
  const selectedBorderClass = selected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''; // Using indigo for selection to differentiate

  return (
    <Card className={`w-72 shadow-md border ${borderColorClass} ${selectedBorderClass}`}>
      <CardHeader className="bg-blue-50 p-3 rounded-t-lg">
        <CardTitle className="text-md flex items-center">
          {hasAudioUrl ? 
            <PlayCircleIcon className="mr-2 h-5 w-5 text-blue-700" /> :
            <MessageCircleIcon className="mr-2 h-5 w-5 text-blue-700" />
          }
          {data.label || 'Play Message'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-sm space-y-1">
        <p className="truncate" title={displayText}>{displayText}</p>
        {data.isValid === false && 
          <p className="text-xs text-red-600 font-semibold">Configure message text or audio URL.</p>
        }
        <Handle type="target" position={Position.Left} className="!bg-blue-500" />
        <Handle type="source" position={Position.Right} className="!bg-blue-500" />
      </CardContent>
    </Card>
  );
} 