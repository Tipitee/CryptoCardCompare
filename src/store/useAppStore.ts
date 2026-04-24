import { create } from 'zustand';
import type { CryptoCard, QuizAnswers, SimulatorSpending } from '../types/card';
import {
  addFavoriteRemote,
  fetchCards,
  fetchFavorites,
  removeFavoriteRemote,
} from '../lib/supabase';

interface AppState {
  cards: CryptoCard[];
  cardsLoading: boolean;
  cardsError: string | null;
  currentMarket: string | undefined;
  favorites: string[];
  compareSelection: string[];
  quizAnswers: QuizAnswers;
  spending: SimulatorSpending;
  loadCards: (market?: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  setQuizAnswer: <K extends keyof QuizAnswers>(k: K, v: QuizAnswers[K]) => void;
  resetQuiz: () => void;
  setSpending: (patch: Partial<SimulatorSpending>) => void;
}

const DEFAULT_SPENDING: SimulatorSpending = {
  online: 200,
  restaurants: 150,
  travel: 50,
  streaming: 30,
  transport: 80,
  supermarket: 300,
  misc: 100,
};

function loadLocalQuiz(): QuizAnswers {
  try {
    const raw = localStorage.getItem('ccc_quiz');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function loadLocalSpending(): SimulatorSpending {
  try {
    const raw = localStorage.getItem('ccc_spending');
    if (raw) return { ...DEFAULT_SPENDING, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULT_SPENDING;
}

export const useAppStore = create<AppState>((set, get) => ({
  cards: [],
  cardsLoading: false,
  cardsError: null,
  currentMarket: undefined,
  favorites: [],
  compareSelection: [],
  quizAnswers: loadLocalQuiz(),
  spending: loadLocalSpending(),

  loadCards: async (market?: string) => {
    const state = get();
    // Skip fetch only if cards are already loaded for the same market
    if (state.cards.length > 0 && state.currentMarket === market) return;
    set({ cardsLoading: true, cardsError: null, currentMarket: market });
    try {
      const cards = await fetchCards(market);
      set({ cards, cardsLoading: false });
    } catch (e) {
      set({
        cardsLoading: false,
        cardsError: e instanceof Error ? e.message : 'Erreur de chargement',
      });
    }
  },

  loadFavorites: async () => {
    try {
      const favs = await fetchFavorites();
      set({ favorites: favs });
    } catch {
      set({ favorites: [] });
    }
  },

  toggleFavorite: async (id: string) => {
    const has = get().favorites.includes(id);
    if (has) {
      set({ favorites: get().favorites.filter((f) => f !== id) });
      try {
        await removeFavoriteRemote(id);
      } catch {
        // ignore
      }
    } else {
      set({ favorites: [...get().favorites, id] });
      try {
        await addFavoriteRemote(id);
      } catch {
        // ignore
      }
    }
  },

  toggleCompare: (id: string) => {
    const sel = get().compareSelection;
    if (sel.includes(id)) {
      set({ compareSelection: sel.filter((x) => x !== id) });
    } else {
      set({ compareSelection: [...sel, id] });
    }
  },

  clearCompare: () => set({ compareSelection: [] }),

  setQuizAnswer: (k, v) => {
    const next = { ...get().quizAnswers, [k]: v };
    set({ quizAnswers: next });
    localStorage.setItem('ccc_quiz', JSON.stringify(next));
  },

  resetQuiz: () => {
    set({ quizAnswers: {} });
    localStorage.removeItem('ccc_quiz');
  },

  setSpending: (patch) => {
    const next = { ...get().spending, ...patch };
    set({ spending: next });
    localStorage.setItem('ccc_spending', JSON.stringify(next));
  },
}));
