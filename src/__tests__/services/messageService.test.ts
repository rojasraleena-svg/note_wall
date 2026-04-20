import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockFrom, mockRpc } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockRpc: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
    rpc: (...args: any[]) => mockRpc(...args),
  },
}));

describe("messageService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchMessages", () => {
    it("should fetch messages with correct pagination", async () => {
      const mockMessages = [
        {
          id: "1",
          nickname: "测试用户",
          content: "你好世界",
          avatar_seed: "abc123",
          likes: 5,
          created_at: "2026-04-09T10:00:00Z",
          is_pinned: false,
        },
      ];

      mockFrom.mockImplementation((table: string) => {
        if (table === "messages") {
          return {
            select: vi.fn().mockImplementation((_cols: string, opts: any) => {
              if (opts?.head) {
                return Promise.resolve({ count: 1, error: null });
              }
              return {
                order: vi.fn().mockReturnValue({
                  order: vi.fn().mockReturnValue({
                    range: vi.fn().mockResolvedValue({
                      data: mockMessages,
                      error: null,
                    }),
                  }),
                }),
              };
            }),
          };
        }
        return {};
      });

      const { fetchMessages } = await import("@/services/messageService");
      const result = await fetchMessages(1, 20);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.data[0].nickname).toBe("测试用户");
    });

    it("should throw error when fetch fails", async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockImplementation(() => ({
          order: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              range: vi.fn().mockResolvedValue({
                data: null,
                error: new Error("DB error"),
              }),
            }),
          }),
        })),
      });

      const { fetchMessages } = await import("@/services/messageService");
      await expect(fetchMessages(1, 20)).rejects.toThrow("DB error");
    });
  });

  describe("createMessage", () => {
    it("should create a message with default nickname when empty", async () => {
      const newMessage = {
        id: "2",
        nickname: "匿名用户",
        content: "测试内容",
        avatar_seed: "xyz789",
        likes: 0,
        created_at: "2026-04-09T11:00:00Z",
        is_pinned: false,
      };

      mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: newMessage,
              error: null,
            }),
          }),
        }),
      });

      const { createMessage } = await import("@/services/messageService");
      const result = await createMessage({ content: "测试内容" });
      expect(result.nickname).toBe("匿名用户");
      expect(result.content).toBe("测试内容");
    });

    it("should use provided nickname when given", async () => {
      const newMessage = {
        id: "3",
        nickname: "小明",
        content: "你好",
        avatar_seed: "def456",
        likes: 0,
        created_at: "2026-04-09T12:00:00Z",
        is_pinned: false,
      };

      mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: newMessage,
              error: null,
            }),
          }),
        }),
      });

      const { createMessage } = await import("@/services/messageService");
      const result = await createMessage({ nickname: "小明", content: "你好" });
      expect(result.nickname).toBe("小明");
    });

    it("should throw error when content is empty", async () => {
      const { createMessage } = await import("@/services/messageService");
      await expect(createMessage({ content: "" })).rejects.toThrow(
        "留言内容不能为空"
      );
    });

    it("should throw error when content exceeds 500 characters", async () => {
      const { createMessage } = await import("@/services/messageService");
      const longContent = "a".repeat(501);
      await expect(createMessage({ content: longContent })).rejects.toThrow(
        "留言内容不能超过 500 字"
      );
    });

    it("should throw error when supabase insert fails", async () => {
      mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: new Error("Insert failed"),
            }),
          }),
        }),
      });

      const { createMessage } = await import("@/services/messageService");
      await expect(createMessage({ content: "测试" })).rejects.toThrow(
        "Insert failed"
      );
    });
  });

  describe("incrementLikes", () => {
    it("should call RPC and return new likes count", async () => {
      mockRpc.mockResolvedValue({ data: 6, error: null });

      const { incrementLikes } = await import("@/services/messageService");
      const result = await incrementLikes("msg-1");
      expect(result).toBe(6);
      expect(mockRpc).toHaveBeenCalledWith("increment_likes", {
        message_id: "msg-1",
      });
    });

    it("should throw error when RPC fails", async () => {
      mockRpc.mockResolvedValue({
        data: null,
        error: new Error("RPC error"),
      });

      const { incrementLikes } = await import("@/services/messageService");
      await expect(incrementLikes("msg-1")).rejects.toThrow("RPC error");
    });

    it("should unwrap array-wrapped scalar response from Supabase RPC", async () => {
      mockRpc.mockResolvedValue({ data: [7], error: null });

      const { incrementLikes } = await import("@/services/messageService");
      const result = await incrementLikes("msg-1");
      expect(result).toBe(7);
    });

    it("should handle plain number response (non-array)", async () => {
      mockRpc.mockResolvedValue({ data: 8, error: null });

      const { incrementLikes } = await import("@/services/messageService");
      const result = await incrementLikes("msg-1");
      expect(result).toBe(8);
    });
  });
});
