### Множество

```typescript
const s = new Set([1, 2, 1])
const a = Array.from(s)
console.log(s)
console.log(a)
```
```
Set(2) { 1, 2 }
[ 1, 2 ]
```

---

### Интерфейс Set

```typescript
interface Set<T> {
    add(value: T): this;
    clear(): void;
    delete(value: T): boolean;
    forEach(
        callbackfn: (value: T, value2: T, set: Set<T>) => void, 
        thisArg?: any): void;
    has(value: T): boolean;
    readonly size: number;
}
```

---

### Интерфейс WeakSet

```typescript
interface WeakSet<T extends WeakKey> {
    add(value: T): this;
    delete(value: T): boolean;
    has(value: T): boolean;
}
```

---

### Операции над множествами

- union (объединение)
- intersect (пересечение)
- subtract (вычитание)

[lodash](https://lodash.com),
[immutable-js](https://immutable-js.com/)

----

### Карта

```typescript
const m = new Map([[1, 2], [3, 4]])
const a = Array.from(m)
const k = m.keys()
const v = m.values()
console.log(m, a, k, v)
```
```
Map(2) { 1 => 2, 3 => 4 } 
[ [ 1, 2 ], [ 3, 4 ] ] 
[Map Iterator] { 1, 3 } 
[Map Iterator] { 2, 4 }    
```

---

### Интерфейс Map

```typescript
interface Map<K, V> {
    clear(): void;
    delete(key: K): boolean;
    forEach(
        callbackfn: (value: V, key: K, map: Map<K, V>) => void, 
        thisArg?: any): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
    readonly size: number;
}
```

---

### Интерфейс WeakMap

```typescript
interface WeakMap<K extends WeakKey, V> {
    delete(key: K): boolean;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
}
```

----

### Тип Stack 

[immutable-js](https://immutable-js.com/)

Stacks are indexed collections which support very efficient O(1) addition and removal from the front using unshift(v) and shift().

Stack is implemented with a Single-Linked List.

---

### Тип OrderedSet

[immutable-js](https://immutable-js.com/)

A type of Set that has the additional guarantee that the iteration order of values will be the order in which they were added.

---

### Коллекция Seq

[immutable-js](https://immutable-js.com/)


```typescript
const oddSquares = Seq([ 1, 2, 3, 4, 5, 6, 7, 8 ])
  .filter(x => x % 2 !== 0)
  .map(x => x * x)
```