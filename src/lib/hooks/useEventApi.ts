import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, EventSchema } from "../api/zodios";
import { z } from "zod";


export type Event = z.infer<typeof EventSchema>;
export type EventInput = Omit<Event, "id" | "createdAt" | "updatedAt">;

export function useEventsQuery() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => apiClient.get("/api/events"),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EventInput) => apiClient.post("/api/events", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      console.error("Lỗi khi tạo sự kiện:", error);
      alert("Không thể tạo sự kiện. Vui lòng thử lại.");
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EventInput }) =>
      apiClient.put("/api/events/:id", data, { params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      console.error("Lỗi khi cập nhật sự kiện:", error);
      alert("Không thể cập nhật sự kiện. Vui lòng thử lại.");
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete("/api/events/:id", undefined, { params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      console.error("Lỗi khi xoá sự kiện:", error);
      alert("Không thể xoá sự kiện. Vui lòng thử lại.");
    },
  });
}
