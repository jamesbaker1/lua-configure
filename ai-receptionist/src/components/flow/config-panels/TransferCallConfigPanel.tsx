'use client';

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TransferCallNodeData } from '@/components/flow/nodes/TransferCallNode';

interface TransferCallConfigPanelProps {
  nodeData: TransferCallNodeData & { isValid?: boolean };
  onDataChange: (newData: Partial<TransferCallNodeData>) => void;
}

const PHONE_REGEX = /^\+[1-9]\d{1,14}$/;

export const TransferCallConfigPanel: React.FC<TransferCallConfigPanelProps> = ({ nodeData, onDataChange }) => {
  const [phoneNumberError, setPhoneNumberError] = React.useState<string | null>(null);

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDataChange({ label: event.target.value });
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = event.target.value;
    onDataChange({ transferToNumber: newNumber });

    if (!newNumber.trim()) {
      setPhoneNumberError('Phone number is required.');
    } else if (!PHONE_REGEX.test(newNumber)) {
      setPhoneNumberError('Invalid phone number format. (e.g., +15551234567)');
    } else {
      setPhoneNumberError(null);
    }
  };
  
  React.useEffect(() => {
    if (!nodeData.transferToNumber?.trim()) {
      setPhoneNumberError('Phone number is required.');
    } else if (!PHONE_REGEX.test(nodeData.transferToNumber)) {
      setPhoneNumberError('Invalid phone number format. (e.g., +15551234567)');
    } else {
      setPhoneNumberError(null);
    }
  }, [nodeData.transferToNumber]);

  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="transfercall-label" className="text-sm font-medium">
          Node Label
        </Label>
        <Input 
          id="transfercall-label" 
          name="label"
          type="text" 
          value={nodeData.label || ''} 
          onChange={handleLabelChange} 
          className="mt-1 w-full"
          placeholder="E.g., Transfer to Sales Dept"
        />
      </div>

      <div>
        <Label htmlFor="transfercall-number" className="text-sm font-medium">
          Transfer to Phone Number
        </Label>
        <Input 
          id="transfercall-number" 
          name="transferToNumber"
          type="tel" 
          value={nodeData.transferToNumber || ''} 
          onChange={handlePhoneNumberChange} 
          className={`mt-1 w-full ${phoneNumberError ? 'border-red-500' : ''}`}
          placeholder="+15551234567"
          aria-describedby="phone-error"
          required
        />
        {phoneNumberError && (
          <p id="phone-error" className="text-xs text-red-600 mt-1">
            {phoneNumberError}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Enter the full phone number including country code (e.g., +15551234567).
        </p>
      </div>
    </div>
  );
}; 