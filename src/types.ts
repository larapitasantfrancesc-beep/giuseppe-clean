export interface ChatMessagePart {
  text: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  parts: ChatMessagePart[];
}
