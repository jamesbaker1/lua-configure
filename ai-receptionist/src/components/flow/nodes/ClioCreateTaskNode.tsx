'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ListPlusIcon, CheckSquareIcon } from 'lucide-react'; // Using ListPlusIcon for Clio + Task

// Mock Clio logo (replace with actual SVG or image component later)
const ClioLogo = () => <span className="font-bold text-blue-600 text-xs mr-1">Clio</span>;

export type ClioCreateTaskNodeData = {
  label: string;
  taskTitle: string;
  taskDescription: string;
  assigneeId?: string;
  dueDateRule?: string; // e.g., "EOD", "+1 day"
};

export function ClioCreateTaskNode({ data }: NodeProps<Node<ClioCreateTaskNodeData>>) {
  return (
    <Card className="w-80 shadow-md border-blue-600 border">
      <CardHeader className="bg-blue-50 p-3 rounded-t-lg">
        <CardTitle className="text-md flex items-center">
          <ClioLogo /> 
          <ListPlusIcon className="mr-2 h-5 w-5 text-blue-700" />
          {data.label || 'Clio: Create Task'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-sm space-y-1">
        <p className="truncate"><strong>Title:</strong> {data.taskTitle || 'Not set'}</p>
        {data.taskDescription && <p className="truncate text-xs"><strong>Desc:</strong> {data.taskDescription}</p>}
        {!data.taskTitle && <p className="text-xs text-gray-500">Configure task details.</p>}
        <Handle type="target" position={Position.Left} className="!bg-blue-600" />
        <Handle type="source" position={Position.Right} className="!bg-blue-600" />
      </CardContent>
    </Card>
  );
} 