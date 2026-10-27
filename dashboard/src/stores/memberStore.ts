import { create } from "zustand";
import { Member } from "@/types";

interface MemberState {
  members: Member[];
  loading: boolean;
  error: string | null;

  setMembers: (members: Member[]) => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  removeMember: (id: string) => void;
  getMemberById: (id: string) => Member | undefined;
}

export const useMemberStore = create<MemberState>((set, get) => ({
  members: [],
  loading: false,
  error: null,

  setMembers: (members) => set({ members }),

  addMember: (member) =>
    set((state) => ({ members: [...state.members, member] })),

  updateMember: (id, updates) =>
    set((state) => ({
      members: state.members.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),

  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
    })),

  getMemberById: (id) => get().members.find((m) => m.id === id),
}));
