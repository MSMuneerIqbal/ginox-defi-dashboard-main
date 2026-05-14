import { useAccount, useBalance, useReadContract, useSignTypedData, useSwitchChain } from 'wagmi';
import { useState, useCallback, useMemo } from 'react';
import { USDC_ADDRESSES, ERC20_ABI } from '@/config/constants';
import { chainMeta } from '@/config/chains';
import { formatBalance, truncateAddress } from '@/shared/utils/format';
import { EIP712_DOMAIN, EIP712_TYPES, isUserRejectionError } from '../types';
import type { SignatureResult, WalletError } from '../types';

export function useWalletData() {
  const { address, isConnected, chain, connector } = useAccount();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { signTypedDataAsync } = useSignTypedData();

  const [signatureResult, setSignatureResult] = useState<SignatureResult | null>(null);
  const [signError, setSignError] = useState<WalletError | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [switchError, setSwitchError] = useState<WalletError | null>(null);

  const chainId = chain?.id ?? 1;
  const usdcAddress = USDC_ADDRESSES[chainId] ?? USDC_ADDRESSES[1];

  const { data: nativeBalance, isLoading: isNativeBalanceLoading } = useBalance({
    address,
    query: { enabled: isConnected },
  });

  const { data: usdcRawBalance, isLoading: isUsdcBalanceLoading } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  });

  const { data: usdcDecimals } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { enabled: isConnected },
  });

  const formattedAddress = useMemo(() => {
    return address ? truncateAddress(address) : '';
  }, [address]);

  const formattedNativeBalance = useMemo(() => {
    if (!nativeBalance) return '0.0000';
    return formatBalance(nativeBalance.value, nativeBalance.decimals);
  }, [nativeBalance]);

  const nativeSymbol = useMemo(() => {
    return nativeBalance?.symbol ?? 'ETH';
  }, [nativeBalance]);

  const usdcBalance = useMemo(() => {
    if (usdcRawBalance === undefined || usdcDecimals === undefined) return '0.00';
    return formatBalance(usdcRawBalance, usdcDecimals, 2);
  }, [usdcRawBalance, usdcDecimals]);

  const networkInfo = useMemo(() => {
    if (!chain) return null;
    return chainMeta[chain.id] ?? { label: chain.name, color: '#627EEA', icon: 'ETH' };
  }, [chain]);

  const handleSwitchChain = useCallback(
    async (targetChainId: number) => {
      setSwitchError(null);
      try {
        await switchChainAsync({ chainId: targetChainId });
      } catch (err) {
        const walletError: WalletError = {
          code: -1,
          message: isUserRejectionError(err)
            ? 'Chain switch was rejected'
            : 'Failed to switch network',
          isUserRejection: isUserRejectionError(err),
        };
        setSwitchError(walletError);
      }
    },
    [switchChainAsync],
  );

  const handleSignMessage = useCallback(async () => {
    if (!address) return;

    setIsSigning(true);
    setSignError(null);
    setSignatureResult(null);

    const message = {
      wallet: address,
      timestamp: BigInt(Math.floor(Date.now() / 1000)),
      action: 'Verify wallet ownership for Ginox Trading Platform',
    };

    try {
      const signature = await signTypedDataAsync({
        domain: { ...EIP712_DOMAIN, chainId },
        types: EIP712_TYPES,
        primaryType: 'Verification',
        message,
      });

      setSignatureResult({
        signature,
        message: {
          wallet: message.wallet,
          timestamp: Number(message.timestamp),
          action: message.action,
        },
      });
    } catch (err) {
      const walletError: WalletError = {
        code: -1,
        message: isUserRejectionError(err)
          ? 'Signature request was rejected'
          : 'Failed to sign message',
        isUserRejection: isUserRejectionError(err),
      };
      setSignError(walletError);
    } finally {
      setIsSigning(false);
    }
  }, [address, chainId, signTypedDataAsync]);

  const clearSignature = useCallback(() => {
    setSignatureResult(null);
    setSignError(null);
  }, []);

  return {
    address,
    isConnected,
    chain,
    connector,
    formattedAddress,
    formattedNativeBalance,
    nativeSymbol,
    usdcBalance,
    isNativeBalanceLoading,
    isUsdcBalanceLoading,
    networkInfo,
    isSwitching,
    switchError,
    handleSwitchChain,
    isSigning,
    signatureResult,
    signError,
    handleSignMessage,
    clearSignature,
  };
}
