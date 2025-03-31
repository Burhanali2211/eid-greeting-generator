import { create } from "zustand";
import type { Greeting } from "./supabase";

interface UserState {
  userId: string | null;
  setUserId: (id: string) => void;
}

interface GreetingState {
  greetings: Greeting[];
  setGreetings: (greetings: Greeting[]) => void;
  addGreeting: (greeting: Greeting) => void;
  updateGreeting: (greeting: Greeting) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
}));

export const useGreetingStore = create<GreetingState>((set) => ({
  greetings: [],
  setGreetings: (greetings) => set({ greetings }),
  addGreeting: (greeting) =>
    set((state) => ({ greetings: [greeting, ...state.greetings] })),
  updateGreeting: (greeting) =>
    set((state) => ({
      greetings: state.greetings.map((g) =>
        g.id === greeting.id ? greeting : g
      ),
    })),
})); 