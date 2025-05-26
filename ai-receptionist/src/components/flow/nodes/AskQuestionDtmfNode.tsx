'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { KeyIcon } from 'lucide-react';

export type DtmfBranch = {
  id: string; // e.g., 'handle-1', 'handle-2'
  digitPattern: string; // e.g., '1', '2', '10-19'
  label: string; // e.g., "On '1' (Sales)"
};

export type AskQuestionDtmfNodeData = {
  label: string;
  questionText: string;
  expectedDigits?: number;
  timeoutSeconds?: number;
  branches: DtmfBranch[];
  noMatchHandleLabel?: string; // e.g., "No Match / Timeout"
};

export function AskQuestionDtmfNode({ data }: NodeProps<Node<AskQuestionDtmfNodeData>>) {
  const baseHandleStyle = { background: '#ff8c00' }; // Orange color for DTMF

  return (
    <Card className="w-80 shadow-md border-orange-500 border">
      <CardHeader className="bg-orange-50 p-3 rounded-t-lg">
        <CardTitle className="text-md flex items-center">
          <KeyIcon className="mr-2 h-5 w-5 text-orange-700" />
          {data.label || 'Ask Question (Keypad)'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-sm space-y-2">
        <p className="truncate"><strong>Q:</strong> {data.questionText || 'No question set.'}</p>
        {data.expectedDigits && <p className="text-xs">Expected Digits: {data.expectedDigits}</p>}
        
        <Handle type="target" position={Position.Left} style={baseHandleStyle} />

        {data.branches?.map((branch: DtmfBranch, index: number) => (
          <div key={branch.id} className="flex justify-between items-center text-xs">
            <span>{branch.label || `On '${branch.digitPattern}'`}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={branch.id}
              style={{ ...baseHandleStyle, top: `${(index + 1) * 25 + 20}px` }}
            />
          </div>
        ))}

        <div className="flex justify-between items-center text-xs mt-1 pt-1 border-t border-dashed">
          <span>{data.noMatchHandleLabel || 'No Match / Timeout'}</span>
          <Handle
            type="source"
            position={Position.Right}
            id="no-match-timeout"
            style={{ ...baseHandleStyle, top: `${((data.branches?.length || 0) + 1) * 25 + 20}px`, background: '#718096' }}
          />
        </div>

      </CardContent>
    </Card>
  );
} 