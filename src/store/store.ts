import create from "zustand";

export type ComponentType = "light" | "air_supply" | "air_return" | "smoke_detector" | "invalid";

export interface GridItem {
  id: string;
  x: number;
  y: number;
  type: ComponentType;
}

type State = {
  width: number;
  height: number;
  components: GridItem[];
  setSize: (w: number, h: number) => void;
  addComponent: (item: GridItem) => void;
  updateComponent: (id: string, data: Partial<GridItem>) => void;
  removeComponent: (id: string) => void;
  clear: () => void;
};

export const useCeilingStore = create<State>((set) => ({
  width: 20,
  height: 12,
  components: [],
  setSize: (w, h) => set({ width: w, height: h }),
  addComponent: (item) =>
    set((s) => ({ components: [...s.components, item] })),
  updateComponent: (id, data) =>
    set((s) => ({
      components: s.components.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),
  removeComponent: (id) =>
    set((s) => ({ components: s.components.filter((c) => c.id !== id) })),
  clear: () => set({ components: [] }),
}));
