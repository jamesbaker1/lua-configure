import { Edge, Node } from '@xyflow/react';
import { AllNodeData } from '@/app/configure/page'; // Assuming AllNodeData is exported from there

export interface CallFlowTemplate {
  id: string;
  name: string;
  description: string;
  nodes: Node<AllNodeData>[];
  edges: Edge[];
}

export const callFlowTemplates: CallFlowTemplate[] = [
  {
    id: 'new-client-intake',
    name: 'New Client Intake',
    description: 'A simple flow to welcome new clients and gather initial information.',
    nodes: [
      {
        id: '1',
        type: 'startCall',
        data: { label: 'Call Begins' },
        position: { x: 0, y: 0 }, // Positions will be set by auto-layout
      },
      {
        id: '2',
        type: 'playMessage',
        data: { label: 'Welcome New Client', messageText: 'Thank you for calling our law firm. We are happy to assist you.' },
        position: { x: 0, y: 0 },
      },
      {
        id: '3',
        type: 'askQuestionSpeech',
        data: {
          label: 'Reason for Calling',
          questionText: 'To help me direct your call, could you briefly tell me the reason for your call today?',
          expectedIntents: [
            { id: 'intent-br-1', intentName: 'NewCase', keywords: ['new case', 'consultation', 'legal help'], label: 'New Case Inquiry' },
          ],
          fallbackHandleLabel: 'Could not understand',
        },
        position: { x: 0, y: 0 },
      },
      {
        id: '4',
        type: 'transferCall',
        data: { label: 'Transfer to Intake Specialist', transferToNumber: '+1234567890' }, // Placeholder number
        position: { x: 0, y: 0 },
      },
      {
        id: '5',
        type: 'recordVoicemail',
        data: { label: 'Voicemail if Unavailable', promptText: 'All our intake specialists are currently busy. Please leave your name, number, and a brief message.'},
        position: { x: 0, y: 0 },
      },
      {
        id: '6',
        type: 'endCall',
        data: { label: 'End Interaction' },
        position: { x: 0, y: 0 },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'intent-br-1' }, // Assuming 'NewCase' intent leads to transfer
      { id: 'e3-5', source: '3', target: '5', sourceHandle: 'fallback' },     // Fallback leads to voicemail
      { id: 'e4-6', source: '4', target: '6' },
      { id: 'e5-6', source: '5', target: '6' },
    ],
  },
  {
    id: 'after-hours-voicemail',
    name: 'After Hours Voicemail',
    description: 'A flow for handling calls received outside of business hours.',
    nodes: [
      {
        id: 'ah-1',
        type: 'startCall',
        data: { label: 'Call Begins (After Hours)' },
        position: { x: 0, y: 0 },
      },
      {
        id: 'ah-2',
        type: 'playMessage',
        data: { label: 'After Hours Greeting', messageText: 'Thank you for calling. Our office is currently closed. Our business hours are Monday to Friday, 9 AM to 5 PM.' },
        position: { x: 0, y: 0 },
      },
      {
        id: 'ah-3',
        type: 'recordVoicemail',
        data: { label: 'Leave After Hours Voicemail', promptText: 'Please leave your name, number, and a brief message, and we will get back to you during our next business day.'},
        position: { x: 0, y: 0 },
      },
      {
        id: 'ah-4',
        type: 'endCall',
        data: { label: 'End Interaction' },
        position: { x: 0, y: 0 },
      },
    ],
    edges: [
      { id: 'e-ah-1-2', source: 'ah-1', target: 'ah-2' },
      { id: 'e-ah-2-3', source: 'ah-2', target: 'ah-3' },
      { id: 'e-ah-3-4', source: 'ah-3', target: 'ah-4' },
    ],
  },
  // Add more templates here (e.g., Support Triage)
]; 