import { vi } from "vitest";

export const mockSupabase = {
  from: vi.fn(),
  rpc: vi.fn(),
};

vi.mock("@/lib/supabase", () => ({
  supabase: mockSupabase,
}));
