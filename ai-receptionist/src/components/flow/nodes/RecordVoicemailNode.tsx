'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { VoicemailIcon } from 'lucide-react';

export type RecordVoicemailNodeData = {
  label: string;
  promptText: string;
  maxRecordingLengthSeconds?: number;
  emailForNotification: string;
};

export function RecordVoicemailNode({ data }: NodeProps<Node<RecordVoicemailNodeData>>) {
  return (
    <Card className="w-72 shadow-md border-rose-500 border">
      <CardHeader className="bg-rose-50 p-3 rounded-t-lg">
        <CardTitle className="text-md flex items-center">
          <VoicemailIcon className="mr-2 h-5 w-5 text-rose-700" />
          {data.label || 'Record Voicemail'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-sm space-y-1">
        <p className="truncate"><strong>Prompt:</strong> {data.promptText || 'Not set'}</p>
        <p className="truncate text-xs"><strong>Email:</strong> {data.emailForNotification || 'Not set'}</p>
        {!data.promptText && <p className="text-xs text-gray-500">Configure prompt & email.</p>}
        <Handle type="target" position={Position.Left} className="!bg-rose-500" />
        <Handle type="source" position={Position.Right} className="!bg-rose-500" /> {/* Output after recording (or failure) */}
      </CardContent>
    </Card>
  );
} 