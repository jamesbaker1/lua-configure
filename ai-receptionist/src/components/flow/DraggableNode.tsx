'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DraggableNodeProps {
  nodeType: string;
  label: string;
  icon?: React.ReactNode;
}

export const DraggableNode: React.FC<DraggableNodeProps> = ({ nodeType, label, icon }) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, type: string) => {
    event.dataTransfer.setData('application/reactflow-nodetype', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card 
      className="p-2 mb-2 cursor-grab hover:shadow-md transition-shadow border-2 border-dashed hover:border-solid hover:border-primary"
      onDragStart={(event) => onDragStart(event, nodeType)}
      draggable
    >
      <CardContent className="p-1 flex items-center">
        {icon && <div className="mr-2">{icon}</div>}
        <span className="text-sm">{label}</span>
      </CardContent>
    </Card>
  );
}; 