'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlayCircleIcon } from 'lucide-react'; // Using a relevant icon

export type StartCallNodeData = {
  label: string;
  // Potentially add config for associated phone number or entry conditions later
};

// NodeProps is generic over the full Node type (Node<StartCallNodeData>).
// The destructured 'data' prop is then the 'data' field of that Node type, which is StartCallNodeData.
export function StartCallNode({ data }: NodeProps<Node<StartCallNodeData>>) {

  // 'data' here IS StartCallNodeData, so we use data.label directly.
  const label = data.label || 'Start Call (fallback)';

  return (
    <Card className="w-64 shadow-lg border-green-500 border-2">
      <CardHeader className="bg-green-100 p-3 rounded-t-lg">
        <CardTitle className="text-md flex items-center">
          <PlayCircleIcon className="mr-2 h-5 w-5 text-green-700" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-sm">
        <p>This is the starting point of your call flow.</p>
        {/* Output handle on the right */}
        <Handle type="source" position={Position.Right} className="!bg-green-500" />
      </CardContent>
    </Card>
  );
} 