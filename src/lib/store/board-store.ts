import { create } from "zustand";
import { supabase } from "../../../supabase/supabase";

export type Board = {
  id: string;
  title: string;
  description: string | null;
  background: string | null;
  created_at: string;
  updated_at: string;
  owner_id: string;
};

export type List = {
  id: string;
  title: string;
  position: number;
  created_at: string;
  updated_at: string;
  board_id: string;
};

export type Card = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  due_date: string | null;
  cover_image: string | null;
  cover_color: string | null;
  priority: string | null;
  created_at: string;
  updated_at: string;
  list_id: string;
};

type BoardState = {
  boards: Board[];
  currentBoard: Board | null;
  lists: List[];
  cards: Card[];
  loading: boolean;
  error: string | null;
  fetchBoards: () => Promise<void>;
  createBoard: (title: string, description?: string) => Promise<string | null>;
  fetchBoardDetails: (boardId: string) => Promise<void>;
  createList: (
    boardId: string,
    title: string,
    position: number,
  ) => Promise<string | null>;
  updateList: (listId: string, title: string) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  createCard: (
    listId: string,
    title: string,
    position: number,
  ) => Promise<string | null>;
  updateCard: (
    cardId: string,
    data: Partial<Omit<Card, "id" | "created_at" | "list_id">>,
  ) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  moveCard: (
    cardId: string,
    destinationListId: string,
    newPosition: number,
  ) => Promise<void>;
  reorderList: (listId: string, newPosition: number) => Promise<void>;
  reorderCard: (cardId: string, newPosition: number) => Promise<void>;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  currentBoard: null,
  lists: [],
  cards: [],
  loading: false,
  error: null,

  fetchBoards: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      set({ boards: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createBoard: async (title, description = "") => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("boards")
        .insert([{ title, description }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        boards: [data, ...state.boards],
        loading: false,
      }));

      return data.id;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  fetchBoardDetails: async (boardId) => {
    set({ loading: true, error: null });
    try {
      // Fetch board details
      const { data: board, error: boardError } = await supabase
        .from("boards")
        .select("*")
        .eq("id", boardId)
        .single();

      if (boardError) throw boardError;

      // Fetch lists for this board
      const { data: lists, error: listsError } = await supabase
        .from("lists")
        .select("*")
        .eq("board_id", boardId)
        .order("position", { ascending: true });

      if (listsError) throw listsError;

      // Fetch all cards for this board's lists
      const listIds = lists.map((list) => list.id);
      let cards: Card[] = [];

      if (listIds.length > 0) {
        const { data: cardsData, error: cardsError } = await supabase
          .from("cards")
          .select("*")
          .in("list_id", listIds)
          .order("position", { ascending: true });

        if (cardsError) throw cardsError;
        cards = cardsData;
      }

      set({
        currentBoard: board,
        lists,
        cards,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createList: async (boardId, title, position) => {
    try {
      const { data, error } = await supabase
        .from("lists")
        .insert([{ board_id: boardId, title, position }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        lists: [...state.lists, data],
      }));

      return data.id;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  updateList: async (listId, title) => {
    try {
      const { error } = await supabase
        .from("lists")
        .update({ title, updated_at: new Date().toISOString() })
        .eq("id", listId);

      if (error) throw error;

      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === listId ? { ...list, title } : list,
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteList: async (listId) => {
    try {
      const { error } = await supabase.from("lists").delete().eq("id", listId);

      if (error) throw error;

      set((state) => ({
        lists: state.lists.filter((list) => list.id !== listId),
        cards: state.cards.filter((card) => card.list_id !== listId),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  createCard: async (listId, title, position) => {
    try {
      const { data, error } = await supabase
        .from("cards")
        .insert([{ list_id: listId, title, position }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        cards: [...state.cards, data],
      }));

      return data.id;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  updateCard: async (cardId, data) => {
    try {
      const { error } = await supabase
        .from("cards")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", cardId);

      if (error) throw error;

      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId ? { ...card, ...data } : card,
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteCard: async (cardId) => {
    try {
      const { error } = await supabase.from("cards").delete().eq("id", cardId);

      if (error) throw error;

      set((state) => ({
        cards: state.cards.filter((card) => card.id !== cardId),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  moveCard: async (cardId, destinationListId, newPosition) => {
    try {
      const { error } = await supabase
        .from("cards")
        .update({
          list_id: destinationListId,
          position: newPosition,
          updated_at: new Date().toISOString(),
        })
        .eq("id", cardId);

      if (error) throw error;

      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId
            ? { ...card, list_id: destinationListId, position: newPosition }
            : card,
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  reorderList: async (listId, newPosition) => {
    try {
      const { error } = await supabase
        .from("lists")
        .update({
          position: newPosition,
          updated_at: new Date().toISOString(),
        })
        .eq("id", listId);

      if (error) throw error;

      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === listId ? { ...list, position: newPosition } : list,
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  reorderCard: async (cardId, newPosition) => {
    try {
      const { error } = await supabase
        .from("cards")
        .update({
          position: newPosition,
          updated_at: new Date().toISOString(),
        })
        .eq("id", cardId);

      if (error) throw error;

      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId ? { ...card, position: newPosition } : card,
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
