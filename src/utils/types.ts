import { ComponentChild } from 'preact';

export interface ErrorMessage {
  id: string;
  text?: ComponentChild;
}

export interface RequestHeighPostMessageProps {
  type: 'requestHeight';
}

export interface ResizePostMessageProps {
  height: number;
  type: 'conversationResize';
}

export interface SetDataPostMessageProps {
  key: string;
  oldValue: unknown;
  value: unknown;
  type: 'setData';
}
