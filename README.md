## 📆 Calendar Event App – Frontend

Frontend cho ứng dụng quản lý sự kiện lịch Dương/Âm và đồng bộ Google Calendar, giao diện hiện đại tích hợp Next.js, React, Tailwind.

---

### 🛠 Công nghệ sử dụng

* **Next.js 15 App Router**
* **React 19** + **React Query 5**
* **TailwindCSS** + ShadCN UI
* **Zod** + **Zodios** (API schema & fetcher)
* **FullCalendar** (lịch hiển thị)
* **vietnamese-lunar-calendar** (ngày âm lịch)

---

### ✨ Hướng dẫn khởi chạy

#### 1. Cài đặt

```bash
npm install
```

#### 2. Khởi chạy dev

```bash
npm run dev
```

#### 3. Build production

```bash
npm run build
npm start
```

> Lưu ý: frontend cần backend chạy ở `http://localhost:3001`

---

### ✅ Đã triển khai

* [x] Giao diện lịch FullCalendar tích hợp ngày Dương + ngày âm
* [x] Highlight mùng 1, rằm và các ngày lễ âm
* [x] Popup tạo/sửa/xoá sự kiện
* [x] Đăng nhập/đăng ký bằng form + Google
* [x] Lưu token JWT trong localStorage + đồng bộ với React Context
* [x] Gửi token trong header Authorization cho API
* [x] Bảo vệ route `/dashboard`, redirect về login nếu chưa xác thực
* [x] Hook `useEventsQuery`, `useCreateEvent`, ... tích hợp React Query + Zodios
* [x] Tự đồng load lại sau khi tạo/sửa/xóa event

---

### 🧍 Chưa triển khai

* [ ] UI calendar dạng danh sách/ngày/tuần
* [ ] Tuỳ chọn giờ nhắc/sự kiện lặp lại
* [ ] Đồng bộ hai chiều với Google Calendar (import events)
* [ ] Cài đặt user: đổi tên, mật khẩu, timezone...
* [ ] Tích hợp PWA/Noti để nhắc lịch
* [ ] Đa ngôn ngữ / Hỗ trợ mobile

---

### 📁 Cấu trúc thư mục

```
src/
├── app/              # App router pages: login, register, dashboard
├── components/       # CalendarView, EventModal, UI shadcn
├── contexts/         # AuthContext (quản lý token)
├── lib/              # zodios client, hook API
└── styles/           # Tailwind, global.css
```
