'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  Position,
  BackgroundVariant,
  NodeTypes,
  ReactFlowProvider,
  useOnSelectionChange,
  useNodesInitialized,
  ReactFlowInstance,
  Controls,
  MiniMap,
  Background,
  Panel,
  ConnectionLineType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
    PlayCircleIcon, MessageSquareTextIcon, KeyIcon, MicIcon, GitForkIcon, 
    PhoneForwardedIcon, VoicemailIcon, ListPlusIcon, FileTextIcon, PhoneOffIcon
} from 'lucide-react';
import dagre from '@dagrejs/dagre';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { callFlowTemplates } from "@/lib/flow-templates";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import all custom nodes and their data types
import { StartCallNode, StartCallNodeData } from '@/components/flow/nodes/StartCallNode';
import { PlayMessageNode, PlayMessageNodeData } from '@/components/flow/nodes/PlayMessageNode';
import { AskQuestionDtmfNode, AskQuestionDtmfNodeData } from '@/components/flow/nodes/AskQuestionDtmfNode';
import { AskQuestionSpeechNode, AskQuestionSpeechNodeData } from '@/components/flow/nodes/AskQuestionSpeechNode';
import { ConditionalBranchNode, ConditionalBranchNodeData } from '@/components/flow/nodes/ConditionalBranchNode';
import { TransferCallNode, TransferCallNodeData } from '@/components/flow/nodes/TransferCallNode';
import { RecordVoicemailNode, RecordVoicemailNodeData } from '@/components/flow/nodes/RecordVoicemailNode';
import { ClioCreateTaskNode, ClioCreateTaskNodeData } from '@/components/flow/nodes/ClioCreateTaskNode';
import { ClioLogCallNode, ClioLogCallNodeData } from '@/components/flow/nodes/ClioLogCallNode';
import { EndCallNode, EndCallNodeData } from '@/components/flow/nodes/EndCallNode';

// Import config panels
import { StartCallConfigPanel } from '@/components/flow/config-panels/StartCallConfigPanel';
import { PlayMessageConfigPanel } from '@/components/flow/config-panels/PlayMessageConfigPanel';
import { AskQuestionDtmfConfigPanel } from '@/components/flow/config-panels/AskQuestionDtmfConfigPanel';
import { AskQuestionSpeechConfigPanel } from '@/components/flow/config-panels/AskQuestionSpeechConfigPanel';
import { ConditionalBranchConfigPanel } from '@/components/flow/config-panels/ConditionalBranchConfigPanel';
import { TransferCallConfigPanel } from '@/components/flow/config-panels/TransferCallConfigPanel';
import { RecordVoicemailConfigPanel } from '@/components/flow/config-panels/RecordVoicemailConfigPanel';
import { ClioCreateTaskConfigPanel } from '@/components/flow/config-panels/ClioCreateTaskConfigPanel';
import { ClioLogCallConfigPanel } from '@/components/flow/config-panels/ClioLogCallConfigPanel';
import { EndCallConfigPanel } from '@/components/flow/config-panels/EndCallConfigPanel';

const nodeTypes: NodeTypes = {
  startCall: StartCallNode,
  playMessage: PlayMessageNode,
  askQuestionDtmf: AskQuestionDtmfNode,
  askQuestionSpeech: AskQuestionSpeechNode,
  conditionalBranch: ConditionalBranchNode,
  transferCall: TransferCallNode,
  recordVoicemail: RecordVoicemailNode,
  clioCreateTask: ClioCreateTaskNode,
  clioLogCall: ClioLogCallNode,
  endCall: EndCallNode,
};

export type AllNodeData = (StartCallNodeData | PlayMessageNodeData | AskQuestionDtmfNodeData | 
                   AskQuestionSpeechNodeData | ConditionalBranchNodeData | TransferCallNodeData |
                   RecordVoicemailNodeData | ClioCreateTaskNodeData | ClioLogCallNodeData | 
                   EndCallNodeData | { label: string }) & { isValid?: boolean };

const initialNodes: Node<AllNodeData, string>[] = [
  {
    id: '1',
    type: 'startCall',
    data: { label: 'Call Begins', isValid: true },
    position: { x: 50, y: 50 },
  },
  {
    id: '2',
    type: 'playMessage',
    data: { label: 'Welcome Message', messageText: 'Hello! Welcome to our service.', audioUrl: '', isValid: true },
    position: { x: 300, y: 50 },
  },
  {
    id: '3',
    type: 'askQuestionDtmf',
    data: {
      label: 'DTMF Input Example',
      questionText: 'Press 1 for Sales, 2 for Support.',
      branches: [
        { id: 'dtmf-br-1', digitPattern: '1', label: 'On \'1\' (Sales)' },
        { id: 'dtmf-br-2', digitPattern: '2', label: 'On \'2\' (Support)' },
      ],
      noMatchHandleLabel: 'Invalid Input / Timeout',
      expectedDigits: 1,
      timeoutSeconds: 10,
      isValid: true 
    },
    position: { x: 50, y: 200 },
  },
  {
    id: '4',
    type: 'askQuestionSpeech',
    data: {
      label: 'Speech Input Example',
      questionText: 'How can I help you today?',
      expectedIntents: [
        { id: 'intent-br-1', intentName: 'Booking', keywords: ['book', 'appointment'], label: 'Intent: Booking' },
      ],
      fallbackHandleLabel: 'Could not understand',
      timeoutSeconds: 15,
      confidenceThreshold: 0.6,
      isValid: true 
    },
    position: { x: 300, y: 200 },
  },
  {
    id: '5',
    type: 'conditionalBranch',
    data: {
      label: 'Time Check Example',
      conditions: [
        { id: 'cond-br-1', variable: 'call.timeOfDay', operator: '>=', value: '09:00', label: 'If Open' },
        { id: 'cond-br-2', variable: 'call.timeOfDay', operator: '<', value: '17:00', label: 'If Still Open' },
      ],
      elseHandleLabel: 'After Hours',
      isValid: true 
    },
    position: { x: 50, y: 350 },
  },
  {
    id: '6',
    type: 'transferCall',
    data: { label: 'Transfer to Agent', transferToNumber: '+1234567890', isValid: true },
    position: { x: 300, y: 350 },
  },
  {
    id: '7',
    type: 'recordVoicemail',
    data: { label: 'Leave a Voicemail', promptText: 'Sorry we missed you. Please leave a message.', emailForNotification: 'test@example.com', isValid: true },
    position: { x: 50, y: 500 },
  },
  {
    id: '8',
    type: 'clioCreateTask',
    data: { label: 'Clio Task: Callback', taskTitle: 'Callback Request', taskDescription: 'Client requested a callback.', isValid: true },
    position: { x: 300, y: 500 },
  },
  {
    id: '9',
    type: 'clioLogCall',
    data: { label: 'Clio Log: Call Details', matterLookupRule: 'caller_id', logNotes: 'Call ended after task creation.', isValid: true },
    position: { x: 50, y: 650 },
  },
  {
    id: '10',
    type: 'endCall',
    data: { label: 'End Interaction', isValid: true },
    position: { x: 300, y: 650 },
  },
];
const initialEdges: Edge[] = [
    {id: 'e1-2', source: '1', target: '2'},
    {id: 'e2-3', source: '2', target: '3'},
    {id: 'e2-4', source: '2', target: '4'},
    {id: 'e4-5', source: '4', target: '5'},
    {id: 'e5-6', source: '5', target: '6', sourceHandle: 'cond-br-1'},
    {id: 'e5-7', source: '5', target: '7', sourceHandle: 'else'},
    {id: 'e7-8', source: '7', target: '8'},
    {id: 'e8-9', source: '8', target: '9'},
    {id: 'e9-10', source: '9', target: '10'},
];

const paletteItemDescriptions: Record<string, string> = {
  startCall: "Begins the call flow when an incoming call is received.",
  playMessage: "Plays a pre-recorded audio message or uses text-to-speech.",
  askQuestionDtmf: "Asks the caller a question and collects their response via keypad (DTMF) input.",
  askQuestionSpeech: "Asks the caller a question and collects their response via speech recognition.",
  conditionalBranch: "Routes the call based on specified conditions (e.g., time of day, caller input).",
  transferCall: "Transfers the call to a specified phone number.",
  recordVoicemail: "Allows the caller to leave a voicemail message.",
  clioCreateTask: "Creates a new task in Clio Manage.",
  clioLogCall: "Logs the details of the call in Clio Manage.",
  endCall: "Ends the call interaction."
};

const paletteItems = [
  { type: 'startCall', label: 'Start Call', icon: <PlayCircleIcon size={18} />, data: { label: 'Start Call' } as StartCallNodeData },
  { type: 'playMessage', label: 'Play Message', icon: <MessageSquareTextIcon size={18} />, data: { label: 'Play Message', messageText: 'Your message here' } as PlayMessageNodeData },
  { type: 'askQuestionDtmf', label: 'Ask (Keypad)', icon: <KeyIcon size={18} />, data: { label: 'Ask (Keypad)', questionText: 'Enter value:', branches: [], noMatchHandleLabel: 'No Match / Timeout' } as AskQuestionDtmfNodeData },
  { type: 'askQuestionSpeech', label: 'Ask (Speech)', icon: <MicIcon size={18} />, data: { label: 'Ask (Speech)', questionText: 'Say something:', expectedIntents: [], fallbackHandleLabel: 'Fallback / No Match' } as AskQuestionSpeechNodeData },
  { type: 'conditionalBranch', label: 'Condition', icon: <GitForkIcon size={18} />, data: { label: 'Condition', conditions: [], elseHandleLabel: 'Else' } as ConditionalBranchNodeData },
  { type: 'transferCall', label: 'Transfer Call', icon: <PhoneForwardedIcon size={18} />, data: { label: 'Transfer Call', transferToNumber: '' } as TransferCallNodeData },
  { type: 'recordVoicemail', label: 'Record Voicemail', icon: <VoicemailIcon size={18} />, data: { label: 'Record Voicemail', promptText: 'Leave message:', emailForNotification: '' } as RecordVoicemailNodeData },
  { type: 'clioCreateTask', label: 'Clio: Create Task', icon: <ListPlusIcon size={18} />, data: { label: 'Clio Task', taskTitle: 'New Task', taskDescription: '' } as ClioCreateTaskNodeData },
  { type: 'clioLogCall', label: 'Clio: Log Call', icon: <FileTextIcon size={18} />, data: { label: 'Clio Log', matterLookupRule: '', logNotes: '' } as ClioLogCallNodeData },
  { type: 'endCall', label: 'End Call', icon: <PhoneOffIcon size={18} />, data: { label: 'End Call' } as EndCallNodeData },
];

let idCounter = initialNodes.length + 1;
const getId = () => `dndnode_${idCounter++}`;

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const nodeWidth = 250; // Adjusted for potentially wider nodes
const nodeHeight = 100; // Adjusted for potentially taller nodes

const getLayoutedElements = (nodes: Node<AllNodeData>[], edges: Edge[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 120 });

  const processedNodes = nodes.map(node => {
    let currentIsValid = node.data.isValid !== undefined ? node.data.isValid : true;
    if (node.type === 'transferCall') {
      const transferData = node.data as TransferCallNodeData;
      currentIsValid = !(!transferData.transferToNumber || transferData.transferToNumber.trim() === '');
    } else if (node.type === 'playMessage') {
      const messageData = node.data as PlayMessageNodeData;
      currentIsValid = !(!messageData.messageText?.trim() && !messageData.audioUrl?.trim());
    }
    // Add more validation for other node types here as needed
    return { ...node, data: { ...node.data, isValid: currentIsValid }};
  });

  processedNodes.forEach((node) => {
    const width = (node.measured?.width && node.measured.width > 0) ? node.measured.width : nodeWidth;
    const height = (node.measured?.height && node.measured.height > 0) ? node.measured.height : nodeHeight;
    dagreGraph.setNode(node.id, { 
        width: Math.max(width, 50),
        height: Math.max(height, 30)
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const isHorizontal = direction === 'LR';

  const layoutedNodes = processedNodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const currentWidth = (node.measured?.width && node.measured.width > 0) ? node.measured.width : nodeWidth;
    const currentHeight = (node.measured?.height && node.measured.height > 0) ? node.measured.height : nodeHeight;
    
    const x = nodeWithPosition.x - Math.max(currentWidth, 50) / 2;
    const y = nodeWithPosition.y - Math.max(currentHeight, 30) / 2;

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: { x, y },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const ConfigureFlow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedNode, setSelectedNode] = useState<Node<AllNodeData> | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<Node<AllNodeData, string>, Edge> | null>(null);
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; nodeId: string } | null>(null);
  const [initialLayoutDone, setInitialLayoutDone] = useState(false);

  const nodesInitialized = useNodesInitialized();

  useEffect(() => {
    if (nodesInitialized && !initialLayoutDone && reactFlowInstance) { // Added reactFlowInstance check here
      console.log("Nodes initialized, applying smart initial layout.");
      const currentNodes = reactFlowInstance.getNodes(); // Using instance's getNodes
      const currentEdges = reactFlowInstance.getEdges(); // Using instance's getEdges

      const { nodes: layoutedNodes, edges: newEdges } = getLayoutedElements(currentNodes, currentEdges, 'TB');
      setNodes(layoutedNodes);
      setEdges(newEdges);
      setInitialLayoutDone(true);
      setTimeout(() => {
        reactFlowInstance?.fitView();
        console.log('Fit view after nodes initialized');
        toast("Flow layout applied automatically.");
      }, 100);
    }
  }, [nodesInitialized, initialLayoutDone, reactFlowInstance, setNodes, setEdges]); // Removed getNodes, edges from deps, added reactFlowInstance, setNodes, setEdges

  useOnSelectionChange({
    onChange: ({ nodes: selectedNodes }) => {
      setSelectedNode(selectedNodes.length === 1 ? selectedNodes[0] as Node<AllNodeData> : null);
    },
  });

  const handleNodeDataChange = (nodeId: string, newData: Partial<AllNodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const mergedData = { ...node.data, ...newData };
          let currentIsValid = true; 
          if (node.type === 'transferCall') {
            const transferData = mergedData as TransferCallNodeData;
            currentIsValid = !(!transferData.transferToNumber || transferData.transferToNumber.trim() === '');
          } else if (node.type === 'playMessage') {
            const messageData = mergedData as PlayMessageNodeData;
            currentIsValid = !(!messageData.messageText?.trim() && !messageData.audioUrl?.trim());
          }
          // Add more validation for other node types here using mergedData
          return { ...node, data: { ...mergedData, isValid: currentIsValid } };
        }
        return node;
      })
    );
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow-nodetype');
      if (typeof type === 'undefined' || !type) return;
      
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const paletteItem = paletteItems.find(item => item.type === type);
      const baseNodeData = paletteItem ? JSON.parse(JSON.stringify(paletteItem.data)) : ({ label: type } as AllNodeData);
      let initialIsValid = true;
      if (type === 'transferCall') {
        initialIsValid = false; // A new transfer node is invalid by default
      } else if (type === 'playMessage') {
        const messageData = baseNodeData as PlayMessageNodeData;
        initialIsValid = !(!messageData.messageText?.trim() && !messageData.audioUrl?.trim());
        if (!messageData.messageText?.trim() && !messageData.audioUrl?.trim()) {
            initialIsValid = false;
        }
      }
      const newNodeDataWithValidation = { ...baseNodeData, isValid: initialIsValid } as AllNodeData;

      const newNode: Node<AllNodeData> = {
        id: getId(),
        type,
        position,
        data: newNodeDataWithValidation,
      };
      const tempNodes = [...nodes, newNode];
      const { nodes: layoutedNodesWithNew } = getLayoutedElements(tempNodes, edges, 'TB');
      setNodes(layoutedNodesWithNew);
    },
    [reactFlowInstance, nodes, edges, setNodes]
  );

  const onLayout = useCallback(
    (direction: string) => {
      const layouted = getLayoutedElements(nodes, edges, direction);
      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
      setSelectedNode(null);
      setTimeout(() => {
        reactFlowInstance?.fitView();
        toast.info("Flow layout applied automatically.");
      }, 100);
    },
    [nodes, edges, setNodes, setEdges, reactFlowInstance]
  );

  const handleLoadTemplate = (templateId: string) => {
    const template = callFlowTemplates.find(t => t.id === templateId);
    if (template) {
      const newNodes = JSON.parse(JSON.stringify(template.nodes));
      const newEdges = JSON.parse(JSON.stringify(template.edges));

      // Ensure new nodes from template also get validation
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges, 'TB');
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setSelectedNode(null); // Deselect any currently selected node
      setTimeout(() => {
        reactFlowInstance?.fitView();
        toast.info("Template Loaded", {
          description: `Template "${template.name}" has been loaded and arranged.`,
        });
      }, 100);
    } else {
      toast.error("Error Loading Template", {
        description: "Could not find the selected template.",
      });
    }
  };

  const renderConfigPanel = () => {
    if (!selectedNode) {
      return <p className="text-sm text-muted-foreground">Select a node to configure its properties.</p>;
    }

    switch (selectedNode.type) {
      case 'startCall':
        return (
          <StartCallConfigPanel 
            nodeData={selectedNode.data as StartCallNodeData} 
            onDataChange={(newData) => handleNodeDataChange(selectedNode.id, newData)} 
          />
        );
      case 'playMessage':
        return (
          <PlayMessageConfigPanel 
            nodeData={selectedNode.data as PlayMessageNodeData} 
            onDataChange={(newData) => handleNodeDataChange(selectedNode.id, newData)} 
          />
        );
      case 'askQuestionDtmf':
        return (
          <AskQuestionDtmfConfigPanel 
            nodeData={selectedNode.data as AskQuestionDtmfNodeData} 
            onDataChange={(newData) => handleNodeDataChange(selectedNode.id, newData)} 
          />
        );
      case 'askQuestionSpeech':
        return (
          <AskQuestionSpeechConfigPanel 
            nodeData={selectedNode.data as AskQuestionSpeechNodeData} 
            onDataChange={(newData) => handleNodeDataChange(selectedNode.id, newData)} 
          />
        );
      case 'conditionalBranch':
        return (
          <ConditionalBranchConfigPanel
            nodeData={selectedNode.data as ConditionalBranchNodeData}
            onDataChange={(newData) => handleNodeDataChange(selectedNode.id, newData)}
          />
        );
      case 'transferCall':
        return (
          <TransferCallConfigPanel
            nodeData={selectedNode.data as TransferCallNodeData}
            onDataChange={(newData) => handleNodeDataChange(selectedNode.id, newData)}
          />
        );
      case 'recordVoicemail':
        return (
          <RecordVoicemailConfigPanel
            nodeData={selectedNode.data as RecordVoicemailNodeData}
            onDataChange={(newData) => handleNodeDataChange(selectedNode.id, newData)}
          />
        );
      case 'clioCreateTask':
        return (
          <ClioCreateTaskConfigPanel
            nodeData={selectedNode.data as ClioCreateTaskNodeData}
            onDataChange={(newData) => handleNodeDataChange(selectedNode.id, newData)}
          />
        );
      case 'clioLogCall':
        return (
          <ClioLogCallConfigPanel
            nodeData={selectedNode.data as ClioLogCallNodeData}
            onDataChange={(newData) => handleNodeDataChange(selectedNode.id, newData)}
          />
        );
      case 'endCall':
        return (
          <EndCallConfigPanel
            nodeData={selectedNode.data as EndCallNodeData}
            onDataChange={(newData) => handleNodeDataChange(selectedNode.id, newData)}
          />
        );
      default:
        return <p className="text-sm">No configuration available for this node type ({selectedNode.type || 'Unknown'}).</p>;
    }
  };

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, nodeLabel: string) => {
    event.dataTransfer.setData('application/reactflow-nodetype', nodeType);
    event.dataTransfer.setData('application/reactflow-nodelabel', nodeLabel);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setSelectedNode(node as Node<AllNodeData>); // Select the node on right click as well
      setContextMenu({
        mouseX: event.clientX,
        mouseY: event.clientY,
        nodeId: node.id,
      });
    },
    [setSelectedNode, setContextMenu]
  );

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDeleteNode = (nodeId: string) => {
    const deletedNode = nodes.find(n => n.id === nodeId);
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null); // Deselect after deleting
    handleCloseContextMenu();
    toast.error(`Node ${deletedNode?.data.label || nodeId} deleted.`);
  };

  const handleDuplicateNode = (nodeId: string) => {
    const originalNode = nodes.find(n => n.id === nodeId);
    if (originalNode) {
      const newNodeId = getId();
      const newNode: Node<AllNodeData> = {
        ...JSON.parse(JSON.stringify(originalNode)), // Deep clone
        id: newNodeId,
        position: {
          x: originalNode.position.x + 30, // Offset new node slightly
          y: originalNode.position.y + 30,
        },
        selected: false, // New node should not be selected initially
        data: { ...originalNode.data, label: `${originalNode.data.label || 'Node'} (Copy)` } // Update label
      };
      // Ensure new node has correct validation state upon duplication
      let isValid = true;
      if (newNode.type === 'transferCall') {
        const transferData = newNode.data as TransferCallNodeData;
        if (!transferData.transferToNumber || transferData.transferToNumber.trim() === '') {
          isValid = false;
        }
      }
      // Add more validation for other node types here for duplication
      newNode.data.isValid = isValid;

      setNodes((nds) => [...nds, newNode]);
      handleCloseContextMenu();

      toast.info(`Node ${originalNode.data.label} duplicated as ${newNode.data.label}.`);
    }
  };

  return (
    <React.Fragment>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full max-h-screen w-full"
      >
        <ResizablePanel defaultSize={20} minSize={15} className="p-2">
          <div className="flex h-full flex-col">
              <h2 className="text-lg font-semibold mb-2 p-2">Node Palette</h2>
              <div className="flex-grow overflow-y-auto p-1 space-y-1">
                  <TooltipProvider delayDuration={100}>
                    <div className="space-y-2">
                      {paletteItems.map((item) => (
                        <Tooltip key={item.type}>
                          <TooltipTrigger asChild>
                            <div
                              draggable
                              onDragStart={(event) => onDragStart(event, item.type, item.label)}
                              className="p-3 border rounded-md flex items-center space-x-3 hover:bg-muted cursor-grab transition-colors"
                            >
                              {item.icon}
                              <span className="text-sm font-medium">{item.label}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="start">
                            <p className="text-xs max-w-xs">{paletteItemDescriptions[item.type] || 'No description available.'}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
              </div>
              <h2 className="text-lg font-semibold mb-2 mt-4 p-2">Configuration</h2>
              <div className="flex-grow overflow-y-auto p-1">
                  {renderConfigPanel()}
              </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80}>
          <div className="h-full w-full relative" ref={reactFlowWrapper} onDragOver={onDragOver} onDrop={onDrop}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              onInit={setReactFlowInstance}
              connectionLineType={ConnectionLineType.SmoothStep}
              className="bg-background"
              onNodeContextMenu={onNodeContextMenu}
              onClick={handleCloseContextMenu}
            >
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
              <Controls />
              <MiniMap />
              <Panel position="top-left">
                <div className="flex space-x-2 p-2 bg-card border rounded-md shadow-lg items-center">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select onValueChange={handleLoadTemplate}>
                          <SelectTrigger className="w-[180px] text-xs h-8">
                            <SelectValue placeholder="Load Template..." />
                          </SelectTrigger>
                          <SelectContent>
                            {callFlowTemplates.map(template => (
                              <SelectItem key={template.id} value={template.id} className="text-xs">
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Load a pre-defined call flow template.</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => onLayout('TB')} className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors h-8">
                          Vertical Layout
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Arrange flow from Top to Bottom.</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => onLayout('LR')} className="px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors h-8">
                          Horizontal Layout
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Arrange flow from Left to Right.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </Panel>

              {contextMenu && (
                <DropdownMenu open onOpenChange={(isOpen: boolean) => !isOpen && handleCloseContextMenu()}>
                  <DropdownMenuTrigger asChild>
                    <div style={{ position: 'fixed', left: contextMenu.mouseX, top: contextMenu.mouseY }} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                      onCloseAutoFocus={(e: Event) => e.preventDefault()}
                      className="w-48"
                  >
                    <DropdownMenuItem onClick={() => handleDuplicateNode(contextMenu.nodeId)}>
                      Duplicate Node
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteNode(contextMenu.nodeId)} className="text-red-600 hover:!text-red-600 hover:!bg-red-50 focus:!text-red-600 focus:!bg-red-50">
                      Delete Node
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </ReactFlow>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </React.Fragment>
  );
}

export default function ConfigurePage() {
    return (
        <ReactFlowProvider>
            <ConfigureFlow />
        </ReactFlowProvider>
    )
}
