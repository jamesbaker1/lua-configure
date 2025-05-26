'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GitForkIcon } from 'lucide-react'; // Icon for branching

export type ConditionBranch = {
  id: string; // Handle ID, e.g., 'handle-condition-1'
  variable: string;
  operator: string; // e.g., '==', '>', 'contains'
  value: any;
  label: string; // e.g., "If CallerID is '5551234'"
};

export type ConditionalBranchNodeData = {
  label: string;
  conditions: ConditionBranch[];
  elseHandleLabel?: string; // e.g., "Else / Default"
};

export function ConditionalBranchNode({ data }: NodeProps<Node<ConditionalBranchNodeData>>) {
  const baseHandleStyle = { background: '#f59e0b' }; // Amber for logic/conditions

  return (
    <Card className="w-80 shadow-md border-amber-500 border">
      <CardHeader className="bg-amber-50 p-3 rounded-t-lg">
        <CardTitle className="text-md flex items-center">
          <GitForkIcon className="mr-2 h-5 w-5 text-amber-700" />
          {data.label || 'Conditional Branch'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-sm space-y-2">
        <p className="text-xs text-gray-600">Evaluates conditions sequentially.</p>
        
        <Handle type="target" position={Position.Left} style={baseHandleStyle} />

        {data.conditions?.map((branch: ConditionBranch, index: number) => (
          <div key={branch.id} className="flex justify-between items-center text-xs">
            <span>{branch.label || `Condition ${index + 1}`}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={branch.id}
              style={{ ...baseHandleStyle, top: `${(index + 1) * 20 + 20}px` }} // Adjusted spacing for potentially more branches
            />
          </div>
        ))}

        <div className="flex justify-between items-center text-xs mt-1 pt-1 border-t border-dashed">
          <span>{data.elseHandleLabel || 'Else / Default'}</span>
          <Handle
            type="source"
            position={Position.Right}
            id="else-branch"
            style={{ ...baseHandleStyle, top: `${((data.conditions?.length || 0) + 1) * 20 + 20}px`, background: '#718096' }}
          />
        </div>

      </CardContent>
    </Card>
  );
} 