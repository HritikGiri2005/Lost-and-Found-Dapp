import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contractConfig';

/**
 * Get the Web3 provider from MetaMask
 */
export const getProvider = () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }
  return new ethers.BrowserProvider(window.ethereum);
};

/**
 * Get the signer (connected wallet)
 */
export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

/**
 * Get the contract instance
 * @param {boolean} withSigner - Whether to use signer for write operations
 */
export const getContract = async (withSigner = false) => {
  const provider = getProvider();
  
  if (withSigner) {
    const signer = await getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }
  
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

/**
 * Connect wallet and return address
 */
export const connectWallet = async () => {
  const provider = getProvider();
  const accounts = await provider.send('eth_requestAccounts', []);
  return accounts[0];
};

/**
 * Get connected wallet address
 */
export const getWalletAddress = async () => {
  const provider = getProvider();
  const accounts = await provider.send('eth_accounts', []);
  return accounts[0] || null;
};

/**
 * Report a lost item
 */
export const reportLostItem = async (name, description, location) => {
  const contract = await getContract(true);
  const tx = await contract.reportLostItem(name, description, location);
  await tx.wait();
  return tx;
};

/**
 * Report a found item
 */
export const reportFoundItem = async (name, description, location) => {
  const contract = await getContract(true);
  const tx = await contract.reportFoundItem(name, description, location);
  await tx.wait();
  return tx;
};

/**
 * Claim an item
 */
export const claimItem = async (id) => {
  const contract = await getContract(true);
  const tx = await contract.claimItem(id);
  await tx.wait();
  return tx;
};

/**
 * Get all items
 */
export const getAllItems = async () => {
  const contract = await getContract();
  const items = await contract.getAllItems();
  return items.map(formatItem);
};

/**
 * Get items reported by current user
 */
export const getMyItems = async () => {
  const contract = await getContract(true);
  const items = await contract.getMyItems();
  return items.map(formatItem);
};

/**
 * Get a single item by ID
 */
export const getItem = async (id) => {
  const contract = await getContract();
  const item = await contract.getItem(id);
  return formatItem(item);
};

/**
 * Format item data from contract
 */
const formatItem = (item) => ({
  id: Number(item.id),
  name: item.name,
  description: item.description,
  location: item.location,
  reporter: item.reporter,
  isLost: item.isLost,
  isClaimed: item.isClaimed,
  timestamp: Number(item.timestamp) * 1000, // Convert to milliseconds
});

/**
 * Format time ago string
 */
export const getTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};

/**
 * Truncate wallet address for display
 */
export const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
