'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PhoneOffIcon } from 'lucide-react';

export type EndCallNodeData = {
  label: string;
  closingMessageText?: string;
};

export function EndCallNode({ data }: NodeProps<Node<EndCallNodeData>>) {
  return (
    <Card className="w-64 shadow-lg border-red-500 border-2">
      <CardHeader className="bg-red-100 p-3 rounded-t-lg">
        <CardTitle className="text-md flex items-center">
          <PhoneOffIcon className="mr-2 h-5 w-5 text-red-700" />
          {data.label || 'End Call'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-sm">
        {data.closingMessageText ? 
          <p className="truncate"><strong>Msg:</strong> {data.closingMessageText}</p> : 
          <p>This is an exit point of your call flow.</p>}
        <Handle type="target" position={Position.Left} className="!bg-red-500" />
        {/* No source handle as this is a terminal node */}
      </CardContent>
    </Card>
  );
} 