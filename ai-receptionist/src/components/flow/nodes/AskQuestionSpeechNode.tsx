'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MicIcon, AlertTriangleIcon } from 'lucide-react';

export type SpeechIntentBranch = {
  id: string; // e.g., 'handle-intent-sales'
  intentName: string;
  keywords: string[];
  label: string; // e.g., "Intent: Sales (keywords: quote, price)"
};

export type AskQuestionSpeechNodeData = {
  label: string;
  questionText: string;
  expectedIntents: SpeechIntentBranch[];
  timeoutSeconds?: number;
  confidenceThreshold?: number;
  fallbackHandleLabel?: string; // e.g., "Fallback / No Match"
};

export function AskQuestionSpeechNode({ data }: NodeProps<Node<AskQuestionSpeechNodeData>>) {
  const baseHandleStyle = { background: '#6366f1' }; // Indigo for Speech AI

  return (
    <Card className="w-80 shadow-md border-indigo-500 border">
      <CardHeader className="bg-indigo-50 p-3 rounded-t-lg">
        <CardTitle className="text-md flex items-center">
          <MicIcon className="mr-2 h-5 w-5 text-indigo-700" />
          {data.label || 'Ask Question (Speech)'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-sm space-y-2">
        <p className="truncate"><strong>Q:</strong> {data.questionText || 'No question set.'}</p>
        
        <Handle type="target" position={Position.Left} style={baseHandleStyle} />

        {data.expectedIntents?.map((branch: SpeechIntentBranch, index: number) => (
          <div key={branch.id} className="flex justify-between items-center text-xs">
            <span>{branch.label || `Intent: ${branch.intentName}`}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={branch.id}
              style={{ ...baseHandleStyle, top: `${(index + 1) * 25 + 20}px` }}
            />
          </div>
        ))}

        <div className="flex justify-between items-center text-xs mt-1 pt-1 border-t border-dashed">
          <span>{data.fallbackHandleLabel || 'Fallback / No Match'}</span>
          <Handle
            type="source"
            position={Position.Right}
            id="fallback-no-match"
            style={{ ...baseHandleStyle, top: `${((data.expectedIntents?.length || 0) + 1) * 25 + 20}px`, background: '#718096' }}
          />
        </div>

      </CardContent>
    </Card>
  );
} 