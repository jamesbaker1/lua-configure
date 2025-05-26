'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PhoneForwardedIcon } from 'lucide-react';

export type TransferCallNodeData = {
  label: string;
  transferToNumber: string;
  announcementText?: string;
};

export function TransferCallNode({ data, selected }: NodeProps<Node<TransferCallNodeData & { isValid?: boolean }>>) {
  const borderColorClass = data.isValid === false ? 'border-red-500' : 'border-teal-500';
  const selectedBorderClass = selected ? 'ring-2 ring-blue-500 ring-offset-2' : '';

  return (
    <Card className={`w-72 shadow-md border ${borderColorClass} ${selectedBorderClass}`}>
      <CardHeader className="bg-teal-50 p-3 rounded-t-lg">
        <CardTitle className="text-md flex items-center">
          <PhoneForwardedIcon className="mr-2 h-5 w-5 text-teal-700" />
          {data.label || 'Transfer Call'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-sm space-y-1">
        <p className="truncate"><strong>To:</strong> {data.transferToNumber || 'Not set'}</p>
        {data.announcementText && <p className="truncate text-xs"><strong>Announce:</strong> {data.announcementText}</p>}
        {!data.transferToNumber && <p className="text-xs text-red-600 font-semibold">Missing transfer number!</p>}
        <Handle type="target" position={Position.Left} className="!bg-teal-500" />
        {/* No source handle typically, as transfer is often a terminal action within a flow path, or logic continues on CPaaS side */}
      </CardContent>
    </Card>
  );
} 