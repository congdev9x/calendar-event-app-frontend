import { makeApi, Zodios, ZodiosPlugin } from "@zodios/core";
import { z } from "zod";

// Schema cho 1 sự kiện
export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  solarDate: z.string().datetime(),
  lunarDate: z.string().nullable().optional(),
  isLunar: z.boolean(),
  reminderMinutesBefore: z.number(),
  googleCalendarEventId: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const EventInputSchema = EventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ✅ TÁCH API definition riêng
export const eventApiDef = makeApi([
  {
    method: "get",
    path: "/api/events",
    alias: "getEvents",
    response: z.array(EventSchema),
  },
  {
    method: "post",
    path: "/api/events",
    alias: "createEvent",
    parameters: [{ name: "body", type: "Body", schema: EventInputSchema }],
    response: EventSchema,
  },
  {
    method: "put",
    path: "/api/events/:id",
    alias: "updateEvent",
    parameters: [
      { name: "id", type: "Path", schema: z.string() },
      { name: "body", type: "Body", schema: EventInputSchema },
    ],
    response: EventSchema,
  },
  {
    method: "delete",
    path: "/api/events/:id",
    alias: "deleteEvent",
    parameters: [{ name: "id", type: "Path", schema: z.string() }],
    response: z.void(),
  },
]);

// ✅ Tạo client với type từ eventApiDef
export const apiClient = new Zodios<typeof eventApiDef>(
  "http://localhost:3001",
  eventApiDef
);

// ✅ Đây là token cache trong module scope
let authToken: string | null = null;

// ✅ Hàm cấu hình token cho các request tiếp theo
export function withToken(token: string | null) {
  authToken = token;
}

// ✅ Plugin chuẩn để gắn Authorization
const authPlugin: ZodiosPlugin = {
  name: "auth",
  request: async (_api, config) => {
    return {
      ...config,
      headers: {
        ...(config.headers ?? {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    };
  },
};


apiClient.use(authPlugin);