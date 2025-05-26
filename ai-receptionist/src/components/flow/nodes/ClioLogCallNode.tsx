'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileTextIcon } from 'lucide-react'; // Icon for logging/matter

// Mock Clio logo (reuse or define if not in same scope)
const ClioLogo = () => <span className="font-bold text-blue-600 text-xs mr-1">Clio</span>;

export type ClioLogCallNodeData = {
  label: string;
  matterLookupRule: string; // e.g., "Ask for Matter ID", "Lookup by Caller ID"
  logNotes: string; // template variables allowed
};

export function ClioLogCallNode({ data }: NodeProps<Node<ClioLogCallNodeData>>) {
  return (
    <Card className="w-80 shadow-md border-blue-600 border">
      <CardHeader className="bg-blue-50 p-3 rounded-t-lg">
        <CardTitle className="text-md flex items-center">
          <ClioLogo />
          <FileTextIcon className="mr-2 h-5 w-5 text-blue-700" />
          {data.label || 'Clio: Log Call to Matter'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-sm space-y-1">
        <p className="truncate"><strong>Lookup:</strong> {data.matterLookupRule || 'Not set'}</p>
        <p className="truncate text-xs"><strong>Notes:</strong> {data.logNotes || '-'}</p>
        {!data.matterLookupRule && <p className="text-xs text-gray-500">Configure lookup & notes.</p>}
        <Handle type="target" position={Position.Left} className="!bg-blue-600" />
        <Handle type="source" position={Position.Right} className="!bg-blue-600" />
      </CardContent>
    </Card>
  );
} 