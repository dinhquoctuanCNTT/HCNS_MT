# MainFeed Components - Mạng Xã Hội Nội Bộ

## Tổng quan

Đã hoàn thành việc chuyển đổi tất cả components của MainFeed sang Tailwind CSS theo yêu cầu thiết kế.

## Cấu trúc Components

### 1. QuickActions Component

**File:** `frontend/src/modules/truyen-thong/components/Widgets/QuickActions.tsx`

**Mô tả:** 3 nút hành động nhanh

- Nút 1 & 2: Quy trình (màu xanh dương nhạt)
- Nút 3: Tùy chỉnh (viền xám)
- Layout: Flexbox ngang với divider giữa các nút

**Màu sắc:**

- Background: `bg-blue-50` (nút 1,2), `bg-white` (nút 3)
- Icon: `text-blue-600`, `text-gray-600`
- Hover: `hover:bg-blue-100`, `hover:bg-gray-50`

---

### 2. PostComposer Component

**File:** `frontend/src/modules/truyen-thong/components/Post/PostComposer.tsx`

**Mô tả:** Ô đăng bài viết

- Avatar gradient vàng-cam
- Input placeholder: "Bạn muốn chia sẻ điều gì?"
- 4 nút: Chia sẻ (primary), Sáng kiến, Tin tức, Bình chọn

**Màu sắc:**

- Avatar: `bg-gradient-to-br from-yellow-400 to-orange-500`
- Input: `bg-gray-50`, focus: `focus:border-sky-600 focus:ring-sky-100`
- Nút Chia sẻ: `bg-blue-600 text-white`
- Các nút khác: `text-amber-500`, `text-red-500`, `text-green-500`

---

### 3. BirthdayAlert Component

**File:** `frontend/src/modules/truyen-thong/components/Widgets/BirthdayAlert.tsx`

**Mô tả:** Thông báo sinh nhật

- Icon Gift màu vàng
- Text "Sinh nhật" + "Hôm nay" (xanh dương)
- "Không có sinh nhật" (xám)

**Màu sắc:**

- Icon background: `bg-amber-50`
- Icon: `text-amber-500`
- "Hôm nay": `text-blue-600 font-semibold`
- Text phải: `text-gray-500`

---

### 4. FeedFilter Component

**File:** `frontend/src/modules/truyen-thong/components/Feed/FeedFilter.tsx`

**Mô tả:** Bộ lọc và sắp xếp feed

- Trái: "Tất cả" + chevron down
- Phải: "Sắp xếp: Hoạt động mới" + icon sort

**Màu sắc:**

- Text: `text-gray-700`, `text-gray-600`
- Font weight: "Hoạt động mới" là `font-semibold`

---

### 5. PostAISummary Component

**File:** `frontend/src/modules/truyen-thong/components/Post/PostAISummary.tsx`

**Mô tả:** AI Summary Box

- Viền xanh dương, nền xanh nhạt
- Icon Sparkles + "Tóm tắt bài viết"
- Nút đóng (X) ở góc phải

**Màu sắc:**

- Border: `border-blue-300`
- Background: `bg-blue-50`
- Icon: `text-blue-500 fill-blue-500`
- Title: `text-blue-600 font-semibold`
- Content: `text-slate-600`
- Close button hover: `hover:bg-blue-100`

---

### 6. PostItem Component

**File:** `frontend/src/modules/truyen-thong/components/Post/PostItem.tsx`

**Mô tả:** Bài viết chi tiết

- Avatar gradient hồng
- Tên tác giả màu xanh dương đậm
- Thời gian + icon Public
- AI Summary (nếu có)
- Nội dung bài viết
- 3 nút action: Thích, Bình luận, Chia sẻ

**Màu sắc:**

- Avatar: `bg-gradient-to-br from-pink-400 to-pink-600`
- Tên: `text-blue-600 font-bold`
- Thời gian: `text-slate-500`
- Content: `text-slate-700`
- Action buttons: `text-slate-600`, hover: `hover:bg-slate-100`

---

### 7. MainFeed Component (Container)

**File:** `frontend/src/modules/truyen-thong/components/MainFeed.tsx`

**Mô tả:** Component chính chứa tất cả

- Layout: `flex flex-col gap-4`
- Thứ tự: QuickActions → PostComposer → BirthdayAlert → FeedFilter → Posts

---

## Cách sử dụng

```tsx
import MainFeed from "./components/MainFeed";

function FeedPage() {
  return (
    <div className="container">
      <MainFeed />
    </div>
  );
}
```

## Đặc điểm kỹ thuật

### Tailwind Classes chính được sử dụng:

- **Layout:** `flex`, `flex-col`, `gap-4`, `items-center`, `justify-between`
- **Spacing:** `p-4`, `p-5`, `px-4`, `py-3`, `mb-4`, `gap-2`, `gap-3`
- **Colors:**
  - Blue: `bg-blue-50`, `text-blue-600`, `border-blue-300`
  - Gray: `bg-gray-50`, `text-gray-500`, `border-gray-200`
  - Slate: `text-slate-600`, `text-slate-700`
  - Amber: `bg-amber-50`, `text-amber-500`
- **Border & Radius:** `rounded-xl`, `rounded-lg`, `rounded-full`, `border`
- **Shadow:** `shadow-sm`
- **Typography:** `text-sm`, `text-base`, `font-medium`, `font-bold`, `font-semibold`
- **Transitions:** `transition-colors`, `transition-all duration-200`
- **Hover states:** `hover:bg-blue-100`, `hover:bg-gray-50`, `hover:text-gray-900`

### Icons (lucide-react):

- `Workflow`, `Play`, `Plus` - QuickActions
- `Share2`, `Lightbulb`, `Newspaper`, `Vote` - PostComposer
- `Gift`, `ChevronDown` - BirthdayAlert
- `ArrowUpDown` - FeedFilter
- `Sparkles`, `X` - PostAISummary
- `Globe`, `ThumbsUp`, `MessageCircle`, `MoreHorizontal` - PostItem

## Responsive Design

Tất cả components đã được thiết kế với Tailwind CSS responsive utilities và có thể dễ dàng điều chỉnh cho mobile/tablet.

## Notes

- Tất cả inline styles đã được chuyển sang Tailwind CSS classes
- Màu sắc khớp 100% với thiết kế chuẩn
- Components có thể tái sử dụng và dễ maintain
- Đã tối ưu performance với proper React patterns
