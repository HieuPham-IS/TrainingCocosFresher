# Design Patterns

## Design Pattern là gì?

**Design Pattern** là các giải pháp hướng đối tượng nâng cao cho những vấn đề phần mềm thường xuyên xảy ra. Chúng không phải là code copy-paste — mà là một _bản thiết kế_ mô tả cách giải quyết vấn đề, có thể tái sử dụng trong nhiều ngữ cảnh khác nhau.

### Tại sao cần Design Pattern?

- **Tái sử dụng** logic đã được kiểm chứng
- **Giao tiếp hiệu quả** giữa các lập trình viên (dùng tên pattern như một từ vựng chung)
- **Giảm coupling** (liên kết lỏng lẻo) giữa các object
- **Dễ bảo trì và mở rộng** hệ thống

---

## 🗂 Tổng quan 5 Design Patterns

| #   | Pattern       | Nhóm       | Mục đích chính                                 |
| --- | ------------- | ---------- | ---------------------------------------------- |
| 1   | **Command**   | Behavioral | Đóng gói hành động thành object                |
| 2   | **Flyweight** | Structural | Tiết kiệm bộ nhớ bằng cách chia sẻ object      |
| 3   | **Observer**  | Behavioral | Hệ thống đăng ký/thông báo sự kiện             |
| 4   | **State**     | Behavioral | Quản lý trạng thái thông qua object riêng biệt |
| 5   | **Singleton** | Creational | Đảm bảo chỉ có 1 instance duy nhất             |

---

## I. Command Pattern

### 1. Nó là gì?

Command Pattern **đóng gói một hành động thành một object**. Nó tách rời _đối tượng yêu cầu_ (requester) khỏi _đối tượng thực thi_ (executor).

Các request này được gọi là **events**, code xử lý chúng là **event handlers**.

### 2. Cấu trúc

```
Client  →  Invoker  →  Command (execute / undo)  →  Receiver
```

| Thành phần   | Vai trò                    | Trong ví dụ        |
| ------------ | -------------------------- | ------------------ |
| **Client**   | Khởi tạo toàn bộ           | `run()` function   |
| **Receiver** | Thực thi hành động thật sự | `Calculator`       |
| **Command**  | Lưu thông tin về hành động | `Command` object   |
| **Invoker**  | Yêu cầu thực thi command   | Người dùng bấm nút |

### 3. Ví dụ

```javascript
var Command = function (execute, undo, value) {
  this.execute = execute;
  this.undo = undo;
  this.value = value;
};

var AddCommand = function (value) {
  return new Command(add, sub, value); // undo của add là sub
};

var Calculator = function () {
  var current = 0;
  var commands = []; // stack lưu lịch sử

  return {
    execute: function (command) {
      current = command.execute(current, command.value);
      commands.push(command);
    },
    undo: function () {
      var command = commands.pop();
      current = command.undo(current, command.value); // đảo ngược
    },
  };
};
```

### 4. Vận dụng trong Game như thế nào?

#### Hệ thống Input / Keybinding

```
Nút "A" pressed  →  MoveLeftCommand.execute()
Nút "A" released →  MoveLeftCommand.undo()
```

Người chơi có thể **tùy chỉnh phím tắt** mà không cần đổi logic game.

#### Undo/Redo trong Game Strategy / Puzzle

- Game cờ: mỗi nước đi là 1 Command → cho phép quay lại
- Puzzle game: hoàn tác bước di chuyển sai

#### Hệ thống Replay

Lưu danh sách Command theo thứ tự → phát lại replay bằng cách thực thi lại từng Command

#### Queue hành động AI / Turn-based

AI tính toán trước 3 bước → đưa vào queue Command → lần lượt thực thi

### 5. Khi nào KHÔNG nên dùng?

- Hành động **không cần undo** và logic đơn giản → thêm overhead không cần thiết
- Game realtime với **hàng nghìn event mỗi giây** → tạo quá nhiều object, ảnh hưởng GC
- Logic chỉ dùng **1 lần, không tái sử dụng** → không đáng thiết kế phức tạp

---

## II. Flyweight Pattern

### 1. Nó là gì?

Flyweight Pattern **tiết kiệm bộ nhớ** bằng cách chia sẻ dữ liệu chung giữa nhiều object thay vì mỗi object lưu một bản sao riêng. Đây là kỹ thuật **"chuẩn hóa object"** — tách dữ liệu chung (intrinsic) ra khỏi dữ liệu riêng (extrinsic).

- **Intrinsic data**: Dữ liệu dùng chung, lưu trong Flyweight (bất biến)
- **Extrinsic data**: Dữ liệu riêng từng instance (thay đổi được)

### 2. Cấu trúc

```
Client  →  FlyweightFactory (pool/cache)  →  Flyweight (shared data)
```

| Thành phần           | Vai trò                   | Trong ví dụ                          |
| -------------------- | ------------------------- | ------------------------------------ |
| **Client**           | Sử dụng flyweight         | `Computer`                           |
| **FlyweightFactory** | Quản lý pool, tái sử dụng | `FlyweightFactory`                   |
| **Flyweight**        | Lưu dữ liệu dùng chung    | `Flyweight` (make, model, processor) |

### 3. Ví dụ

```javascript
function Flyweight(make, model, processor) {
  this.make = make; // dữ liệu chung
  this.model = model;
  this.processor = processor;
}

var FlyWeightFactory = (function () {
  var flyweights = {}; // cache pool

  return {
    get: function (make, model, processor) {
      // Chỉ tạo mới nếu chưa có trong cache
      if (!flyweights[make + model]) {
        flyweights[make + model] = new Flyweight(make, model, processor);
      }
      return flyweights[make + model]; // trả về object đã có
    },
  };
})();

// 7 Computer objects nhưng chỉ cần 2 Flyweight objects!
```

### 4. Vận dụng trong Game như thế nào?

#### Hệ thống Particle Effects

Hàng nghìn hạt lửa, khói — mỗi hạt có vị trí, tốc độ riêng (extrinsic), nhưng **texture, màu sắc, kích thước cơ bản** dùng chung (intrinsic).

#### Spawn nhiều Enemy cùng loại

```
1000 Goblin  →  chỉ 1 GoblinFlyweight (sprite, stats, AI config)
               mỗi Goblin chỉ lưu: vị trí, HP hiện tại, target
```

#### Hệ thống Tile Map

Map 100×100 = 10.000 tile, nhưng chỉ có ~20 loại tile → dữ liệu loại tile (texture, collision) dùng Flyweight

#### Bullet Hell Games

Hàng trăm viên đạn cùng loại → dữ liệu đạn (sprite, damage type) dùng chung qua Flyweight

### 5. Khi nào KHÔNG nên dùng?

- Số lượng object ít → overhead của factory/pool không đáng
- Hầu hết dữ liệu là **extrinsic** (riêng biệt) → không có gì để chia sẻ
- **Object thường xuyên thay đổi** intrinsic data → vi phạm tính bất biến của Flyweight
- Code trở nên phức tạp khó đọc hơn lợi ích tiết kiệm bộ nhớ

---

## III. Observer Pattern

### 1. Nó là gì?

Observer Pattern cung cấp mô hình **đăng ký (subscribe) / thông báo (notify)**: các object đăng ký lắng nghe một event, và được tự động thông báo khi event đó xảy ra.

Đây là **nền tảng của lập trình hướng sự kiện (event-driven programming)**. Tên khác: **Pub/Sub** (Publication/Subscription).

### 2. Cấu trúc

```
Subject (Publisher)  →  [notify all]  →  Observer 1
                                      →  Observer 2
                                      →  Observer 3
```

| Thành phần   | Vai trò                                   | Trong ví dụ    |
| ------------ | ----------------------------------------- | -------------- |
| **Subject**  | Duy trì danh sách observers, phát sự kiện | `Click`        |
| **Observer** | Hàm được gọi khi event xảy ra             | `clickHandler` |

### 3. Ví dụ

```javascript
Click.prototype = {
  subscribe: function (fn) {
    this.handlers.push(fn); // đăng ký observer
  },
  unsubscribe: function (fn) {
    this.handlers = this.handlers.filter((item) => item !== fn); // hủy đăng ký
  },
  fire: function (o, thisObj) {
    var scope = thisObj || window;
    this.handlers.forEach(function (item) {
      item.call(scope, o); // thông báo tất cả observers
    });
  },
};

// Sử dụng:
click.subscribe(clickHandler); // đăng ký lắng nghe
click.fire("event #1"); // thông báo
click.unsubscribe(clickHandler); // hủy lắng nghe
```

### 4. Vận dụng trong Game như thế nào?

#### Hệ thống Event Game-wide

```
EventManager.on('player_died', updateScoreboard);
EventManager.on('player_died', playDeathSound);
EventManager.on('player_died', spawnRespawnEffect);
// Player chết → tự động trigger tất cả
```

#### UI cập nhật theo trạng thái

HP bar, mana bar, điểm số — subscribe vào `player.stats` → tự động cập nhật khi stat thay đổi mà không cần gọi thủ công.

#### Achievement / Quest System

Quest "Giết 10 goblin" subscribe vào event `enemy_killed` → tự đếm mà không cần thêm code vào logic combat.

#### Hệ thống âm thanh phản ứng theo sự kiện

```
SoundManager.on('explosion', playExplosionSound);
SoundManager.on('pickup_coin', playCoinSound);
```

#### Multiplayer / Network Sync

Client subscribe các event server broadcast → nhận update vị trí player khác, trạng thái game.

### 5. Khi nào KHÔNG nên dùng?

- Quan hệ quá đơn giản giữa 2 object → gọi thẳng function rõ ràng hơn
- Chuỗi observer quá dài và phức tạp → **khó debug** (không biết ai đã trigger cái gì)
- **Thứ tự thực thi** quan trọng → Observer không đảm bảo thứ tự gọi
- Quên **unsubscribe** → gây **memory leak** (phổ biến trong game mobile)
- Performance-critical code (update loop mỗi frame) → overhead của dispatch event quá lớn

---

## IV. State Pattern

### 1. Nó là gì?

State Pattern cung cấp logic riêng biệt cho từng trạng thái thông qua các State object độc lập. Mỗi State object đại diện cho một trạng thái cụ thể và tự quyết định việc chuyển sang trạng thái tiếp theo.

Thay vì dùng `if/else` hay `switch` khổng lồ, ta tạo **một class cho mỗi trạng thái**.

### 2. Cấu trúc

```
Context  ←→  State (current)
              ↓ (tự chuyển)
           State (next)
```

| Thành phần  | Vai trò                                     | Trong ví dụ              |
| ----------- | ------------------------------------------- | ------------------------ |
| **Context** | Giữ reference đến state hiện tại            | `TrafficLight`           |
| **State**   | Đóng gói logic và quy tắc chuyển trạng thái | `Red`, `Yellow`, `Green` |

### 3. Ví dụ

```javascript
var TrafficLight = function () {
  var currentState = new Red(this); // trạng thái ban đầu

  this.change = function (state) {
    currentState = state;
    currentState.go();
  };
};

var Red = function (light) {
  this.go = function () {
    log.add("Red --> for 1 minute");
    light.change(new Green(light)); // Red tự biết chuyển sang Green
  };
};

var Green = function (light) {
  this.go = function () {
    log.add("Green --> for 1 minute");
    light.change(new Yellow(light)); // Green chuyển sang Yellow
  };
};

var Yellow = function (light) {
  this.go = function () {
    log.add("Yellow --> for 10 seconds");
    light.change(new Red(light)); // Yellow chuyển lại Red
  };
};
```

### 4. Vận dụng trong Game như thế nào?

#### State Machine của Enemy AI

```
Idle → Patrol → Chase → Attack → Dead
```

Mỗi state có logic riêng: `Idle` đứng yên, `Chase` đuổi player, `Attack` tấn công. Mỗi state tự biết khi nào chuyển sang state khác.

#### Trạng thái nhân vật chính

```
Standing → Running → Jumping → Falling → Attacking → Stunned
```

Tránh `if player.isJumping && !player.isAttacking && !player.isStunned...`

#### Game Flow / Scene State

```
MainMenu → Loading → Playing → Paused → GameOver
```

#### Vending Machine / Puzzle Mechanism

```
Waiting → CoinInserted → Dispensing → OutOfStock
```

#### Weapon State

```
Ready → Firing → Reloading → Overheated → Broken
```

### 5. Khi nào KHÔNG nên dùng?

- Object chỉ có **2-3 trạng thái đơn giản** → `if/else` ngắn gọn hơn
- Các trạng thái **không có logic riêng biệt**, chỉ là data flag
- Số lượng trạng thái rất lớn và **chuyển tiếp phức tạp** → cân nhắc dùng State Machine framework thay vì tự viết
- Trạng thái không phụ thuộc vào nhau → không cần pattern này

---

## V. Singleton Pattern

### 1. Nó là gì?

Singleton Pattern **giới hạn chỉ 1 instance** của một class trong toàn bộ ứng dụng. Instance này được gọi là **singleton**.

Nó cũng áp dụng kỹ thuật **Lazy Load**: chỉ tạo instance khi thực sự cần, tiết kiệm CPU và bộ nhớ.

### 2. Cấu trúc

```
Singleton.getInstance()
    ↓ lần đầu: tạo instance mới
    ↓ lần sau: trả về instance đã có
```

| Thành phần    | Vai trò                                                | Trong ví dụ        |
| ------------- | ------------------------------------------------------ | ------------------ |
| **Singleton** | Tự quản lý instance duy nhất, cung cấp `getInstance()` | `Singleton` object |

### 3. Ví dụ

```javascript
var Singleton = (function () {
  var instance; // private, không ai bên ngoài truy cập được

  function createInstance() {
    var object = new Object("I am the instance");
    return object;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance(); // lazy load: chỉ tạo khi cần
      }
      return instance; // luôn trả về cùng một object
    },
  };
})();

// Kiểm tra:
var instance1 = Singleton.getInstance();
var instance2 = Singleton.getInstance();
alert(instance1 === instance2); // true — cùng 1 object!
```

### 4. Vận dụng trong Game như thế nào?

#### - GameManager / GameController

```javascript
// Toàn bộ game chỉ cần 1 GameManager duy nhất
var GameManager = Singleton.getInstance();
GameManager.score = 100;
GameManager.level = 3;
```

#### - AudioManager

Chỉ có 1 audio engine quản lý toàn bộ âm thanh — tránh nhiều instance cùng phát nhạc.

#### - ResourceManager / AssetLoader

Quản lý cache texture, audio, prefab — 1 instance duy nhất tránh load trùng tài nguyên.

#### - EventBus / EventDispatcher

Trung tâm phát/nhận event toàn game — cần là Singleton để mọi nơi cùng subscribe vào 1 chỗ.

#### - SaveManager / DataManager

Quản lý save/load game data — phải là 1 instance để tránh conflict khi đọc/ghi.

#### - NetworkManager

Quản lý kết nối server — không thể có 2 connection manager song song.

### 5. Khi nào KHÔNG nên dùng?

- Cần **nhiều instance** của class đó (ví dụ: nhiều Player trong multiplayer)
- **Unit testing** trở nên khó — Singleton giữ state toàn cục, các test ảnh hưởng nhau
- Dẫn đến **god object** nếu lạm dụng — nhét quá nhiều logic vào 1 Singleton
- Trong môi trường **multi-threaded** phức tạp — cần xử lý thread-safety thêm
- Tạo **tight coupling** ẩn — mọi nơi đều phụ thuộc vào Singleton mà không rõ ràng

---

## So sánh nhanh 5 Patterns

| Pattern       | Vấn đề giải quyết                            | Từ khóa nhớ               |
| ------------- | -------------------------------------------- | ------------------------- |
| **Command**   | Tách requester & executor, hỗ trợ undo/redo  | _"Đóng gói hành động"_    |
| **Flyweight** | Tiết kiệm bộ nhớ khi nhiều object giống nhau | _"Chia sẻ dữ liệu chung"_ |
| **Observer**  | Thông báo nhiều object khi có sự kiện        | _"Subscribe & Notify"_    |
| **State**     | Quản lý hành vi thay đổi theo trạng thái     | _"Mỗi state là 1 class"_  |
| **Singleton** | Đảm bảo chỉ 1 instance toàn cục              | _"Chỉ 1 thôi"_            |

---

## Kết hợp các Patterns trong một Game thực tế

Trong một game Cocos Creator , các patterns thường được kết hợp:

```
GameManager (Singleton)
    ↓ phát event
EventBus (Observer/Singleton)
    ↓ notify
UIManager (Observer) → cập nhật HP bar
QuestManager (Observer) → kiểm tra điều kiện quest
AudioManager (Singleton) → phát âm thanh

Player Input → InputCommand (Command) → PlayerController
Enemy AI → StateMachine (State) → Idle/Chase/Attack
BulletPool → BulletFlyweight (Flyweight) → 500 bullets, 1 shared data
```
