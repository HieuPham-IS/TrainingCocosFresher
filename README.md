# EXERCISE1: CACHE MODE

## 1. Khái niệm Cache Mode

Cache Mode là cách mà engine xử lý và vẽ text của cc.Label.

Mặc định, mỗi Label trong Cocos Creator sẽ được vẽ trực tiếp lên màn hình dưới dạng các lệnh vẽ (draw calls). Khi thay đổi Cache Mode, sẽ thay đổi cách engine xử lý việc render các ký tự đó từ bộ nhớ đệm.

Thay vì mỗi frame đều vẽ lại chữ, engine có thể:

* Vẽ 1 lần -> lưu vào texture (cache)
* Sau đó chỉ cần render lại texture

---

## 2. Các loại Cache Mode

**NONE**: Mỗi label được coi là một đối tượng riêng biệt, vẽ trực tiếp mỗi frame

**BITMAP**: Chuyển nội dung Label thành một bức ảnh (Sprite Frame) và lưu vào một bộ nhớ đệm dùng chung (Dynamic Atlas)

**CHAR**: Chia nhỏ từng ký tự trong Label thành các ảnh riêng lẻ và lưu chúng vào một Atlas dùng

---

## 3. Công dụng và so sánh chi tiết các loại Cache Mode

| Đặc điểm | NONE | BITMAP | CHAR |
| :--- | :--- | :--- | :--- |
| **Cơ chế** | Vẽ lại mỗi khi có thay đổi | Chụp cả cụm từ thành 1 tấm ảnh | Lưu từng chữ cái (A, B, ...) và cache |
| **Draw Call** | Cao (Mỗi Label = 1 hoặc nhiều DC) | Rất thấp (Có thể batching tốt) | Thấp (Tái sử dụng ký tự) |
| **Bộ nhớ** | Thấp | Cao (Tạo ra nhiều ảnh tạm) | Trung bình |
| **Độ sắc nét** | Cao nhất | Dễ bị mờ nếu scale | Tốt cho system font |

## Chú ý:
- **NONE:** Phù hợp cho các nhãn (Label) thường xuyên thay đổi nội dung (như đồng hồ đếm giây).
- **BITMAP:** Tốt nhất cho các nhãn tĩnh, số lượng nhiều nhưng ít thay đổi (như tên quái vật, số lượng vật phẩm).
- **CHAR:** Phù hợp cho các đoạn văn bản dài hoặc các nhãn sử dụng font hệ thống mà cần tối ưu hiệu năng.
"""

---

## 4. Dùng khi

### Chế độ BITMAP

Dùng khi: Các nhãn văn bản ít thay đổi nội dung (VD: Tên item, tiêu đề popup, nhãn tĩnh)

Ưu điểm: Giảm đáng kể Draw Call vì engine sẽ gom các Label này lại để vẽ một lần (batching)

Nhược điểm: Nếu nội dung thay đổi liên tục (như đồng hồ đếm giây), nó sẽ bắt engine phải chụp ảnh liên tục, gây giật lag

---

### Chế độ CHAR

Dùng khi: Các nhãn văn bản thay đổi nội dung liên tục nhưng tập hợp ký tự lặp lại nhiều (VD: Số điểm tăng dần, số sát thương, chat)

Ưu điểm: Hiệu suất cực cao cho các chuỗi văn bản dài. Chỉ vẽ ký tự mới nếu chưa có cache

Nhược điểm: Chỉ hỗ trợ system font và một số TTF nhất định. Không hoạt động với Bitmap Font

---

## 5. Ưu nhược điểm tổng quát

### Ưu điểm

* Tối ưu Draw Call: Đây là cách nhanh nhất để giảm Draw của UI từ hàng chục xuống còn 1-2
* Mượt mà trên Mobile: Giảm tải cho GPU khi phải xử lý quá nhiều lệnh vẽ văn bản

### Nhược điểm

* Tốn RAM: Việc lưu trữ các tấm ảnh văn bản vào bộ nhớ đệm sẽ chiếm dung lượng RAM. Nếu không kiểm soát có thể tràn bộ nhớ
* Hiện tượng mờ: Nếu dùng BITMAP rồi scale lớn, chữ sẽ bị vỡ nét vì đã thành bitmap

---

## 6. Những điều cần chú ý khi dùng Cache Mode

* Tránh thay đổi nội dung liên tục ở mode BITMAP: Nếu gán label.string mỗi frame sẽ gây drop FPS nặng
* Dọn dẹp Cache: Cache Mode không tự giải phóng ngay. Nếu có nhiều Scene với nhiều Label BITMAP cần chú ý bộ nhớ
* Hạn chế dùng với Label quá dài: Nếu text dài, engine sẽ tạo texture rất lớn gây tốn tài nguyên
* Sử dụng Label Atlas thay thế nếu có thể: Đặc biệt với số (điểm, tiền) thì LabelAtlas hoặc BMFont tối ưu hơn
* Kiểm tra trên thiết bị thật: Một số máy Android cũ xử lý Dynamic Atlas chậm, có thể gây lỗi hiển thị

---

# EXERCISE 2: LIFECYCLE OF A COMPONENT

## 1. Lifecycle là gì?

Lifecycle là thứ tự các hàm được engine gọi tự động trong suốt thời gian tồn tại của một component.

Hiểu đơn giản:
- Component được tạo → chạy → update → bị destroy
- Trong từng giai đoạn → engine gọi các hàm tương ứng

---

## 2. Luồng lifecycle

`onLoad` → `onEnable` → `start` → `update` → `lateUpdate` → `onDisable` → `onDestroy`

---

## 3. Giai đoạn Khởi tạo (Initialization)

### onLoad()

**Khi nào chạy:**
- Khi node + component được load vào scene
- Chỉ chạy 1 lần

**Công dụng:**
- Khởi tạo dữ liệu
- Lấy reference component khác

**Ví dụ:**
```js
onLoad() {
    this.player = this.node.getComponent(Player);
}
```

**Hạn chế:**
- Không đảm bảo component khác đã start
- Không nên dùng cho logic phụ thuộc lẫn nhau

---

### onEnable()

**Khi nào chạy:**
- Khi component được enable
- Có thể chạy nhiều lần

**Công dụng:**
- Đăng ký event
- Lắng nghe input

**Ví dụ:**
```js
onEnable() {
   cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
}
```

**Lưu ý:**
- Phải unregister ở onDisable

---

### start()

**Khi nào chạy:**
- Sau onLoad
- Sau khi tất cả component đã onLoad xong

**Công dụng:**
- Logic phụ thuộc component khác

**Ví dụ:**
```js
start() {
   this.enemy = cc.find("Enemy").getComponent(Enemy);
}
```

---

## 4. Giai đoạn Cập nhật (Update Loop)

### update(dt)

**Khi nào chạy:**
- Mỗi frame (~60 lần/giây)

**Công dụng:**
- Game logic realtime
- Movement, animation

**dt là gì:**
- Delta time = thời gian giữa 2 frame

**Ví dụ:**
```js
update(dt) {
   this.node.x += 100 * dt;
}
```

---

### lateUpdate(dt)

**Khi nào chạy:**
- Sau tất cả update()

**Công dụng:**
- Fix position sau khi mọi thứ đã update
- Ví dụ: camera follow player

---

## 5. Giai đoạn Kết thúc (Destruction)

### onDisable()

**Khi nào:**
- Component bị disable

**Công dụng:**
- Cleanup event

```js
onDisable() {
   cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
}
```

---

### onDestroy()

**Khi nào:**
- Node hoặc component bị destroy

**Công dụng:**
- Giải phóng tài nguyên

---

## 6. Ưu điểm của lifecycle

- Tách logic rõ ràng
  - Init → onLoad
  - Setup → start
  - Runtime → update

- Engine quản lý tự động
  - Không cần tự gọi hàm
  - Giảm bug logic

- Phù hợp game loop
  - update = game loop chuẩn

---

## 7. Nhược điểm / hạn chế

- Khó debug nếu không hiểu thứ tự
- Dependency giữa component dễ gây lỗi null/undefined
- update() dễ gây lag nếu code nặng
- Event leak nếu quên off
- onDestroy không luôn được gọi trong một số trường hợp

---

## 8. Khi nào dùng cái gì

- onLoad: init biến, cache component
- start: logic cần object khác
- update: movement, timer, gameplay
- onEnable / onDisable: event, input
- onDestroy: cleanup resource

---

## 9. Những điều cần chú ý

### Không lạm dụng update

❌:
```js
update() {
   let enemy = cc.find("Enemy");
}
```

✅:
```js
onLoad() {
   this.enemy = cc.find("Enemy");
}
```

---

### this trong lifecycle
- Luôn dùng: `this.variable`

---

### Không khởi tạo nặng trong onLoad
- Load asset lớn nên dùng async

---

### Pooling vs Destroy
- destroy → gọi onDestroy
- reuse → chỉ onEnable/onDisable

---

### Node active ảnh hưởng lifecycle

```js
node.active = false;
```

→ trigger:
- onDisable
