import { HistoryItem, Device } from '../types';
import { MOCK_DEVICES } from '../data/mockDevices';

const STORAGE_KEY = 'techlens_search_history_v1';

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with sample devices so Dona Maria or Carlos sees how it works
      const initial: HistoryItem[] = [
        {
          id: 'hist-1',
          searchedAt: 'Ontem às 15:40',
          device: MOCK_DEVICES[0],
          searchMethod: 'camera'
        },
        {
          id: 'hist-2',
          searchedAt: 'Há 3 dias atrás',
          device: MOCK_DEVICES[1],
          searchMethod: 'manual'
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading history from localStorage:', e);
    return [];
  }
}

export function saveHistory(device: Device, method: 'camera' | 'upload' | 'manual'): HistoryItem {
  const history = getHistory();
  const newItem: HistoryItem = {
    id: 'hist-' + Date.now(),
    searchedAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    device,
    searchMethod: method
  };

  // Prepend to top and remove duplicates of same device
  const filtered = history.filter(item => item.device.id !== device.id);
  const updated = [newItem, ...filtered];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving history to localStorage:', e);
  }

  return newItem;
}

export function removeHistoryItem(id: string): HistoryItem[] {
  const history = getHistory();
  const updated = history.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating history in localStorage:', e);
  }
  return updated;
}

export function clearHistory(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (e) {
    console.error('Error clearing history in localStorage:', e);
  }
}

