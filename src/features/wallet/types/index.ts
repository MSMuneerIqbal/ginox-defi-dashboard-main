export interface SignatureResult {
  signature: string;
  message: Record<string, unknown>;
}

export interface WalletError {
  code: number;
  message: string;
  isUserRejection: boolean;
}

export const EIP712_DOMAIN = {
  name: 'Ginox Trading Platform',
  version: '1',
  chainId: 1,
} as const;

export const EIP712_TYPES = {
  Verification: [
    { name: 'wallet', type: 'address' },
    { name: 'timestamp', type: 'uint256' },
    { name: 'action', type: 'string' },
  ],
} as const;

export function isUserRejectionError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes('user rejected') ||
      msg.includes('user denied') ||
      msg.includes('rejected the request') ||
      msg.includes('action_rejected')
    );
  }
  return false;
}
