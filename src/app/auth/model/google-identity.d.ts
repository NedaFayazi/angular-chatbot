declare global {
  type GoogleCredentialResponse = {
    credential: string;
    select_by?: string;
  };

  type GoogleIdConfiguration = {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  };

  type GoogleButtonConfiguration = {
    type?: 'standard' | 'icon';
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: number | string;
    locale?: 'en',
  };

  type GoogleAccountsId = {
    initialize: (configuration: GoogleIdConfiguration) => void;
    renderButton: (parent: HTMLElement, options: GoogleButtonConfiguration) => void;
    prompt: () => void;
  };

  interface Window {
    google: {
      accounts: {
        id: GoogleAccountsId;
      };
    };
  }
}

export {};
