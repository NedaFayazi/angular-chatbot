export type UserMessageKind = 'error' | 'warning' | 'info' | 'success';

export type UserMessage = {
  id: string;
  kind: UserMessageKind;
  text: string;
};
