### Коллекции

---

### Итератор

```typescript
const a=[1,2,3,4,5]
// Обычный цикл
for(let i=0; i<a.length; i++){
    console.log(a[i])
}

// Используем итератор
for (let n of a)
    console.log(n)
```

---

### Интерфейсы итерации

```typescript
interface Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
}

interface Iterator<TReturn = any, ...> {   
    next(...): IteratorResult<TReturn ...>;
    ...
}

interface IteratorReturnResult<TReturn> {
    done: true;
    value: TReturn;
}
```

---

### Пример итератора

```typescript
class myIterator implements Iterable<number> {
    [Symbol.iterator](): Iterator<number, any, undefined> {
        let count = 0
        return {
            next() {
                if (count < 5) {
                    return { done: false, value: count++ };
                }
                return { done: true, value: count++ };
            }
        }
    }
}
```

---

<div class='quiz' data-quiz='{ 
    "question": "Какие методы должны быть в итераторе?",    
    "right": [ 
        "<code>next</code>"
    ],
    "wrong": [
        "<code>value</code>",
        "<code>done</code>",
        "<code>iterable</code>"
    ]
}'></div>

---

<div class='quiz' data-quiz='{ 
    "question": "Какие свойства должны быть в объекте, возвращаемом из итератора?",    
    "right": [ 
        "<code>value</code>",
        "<code>done</code>"
    ],
    "wrong": [
        "<code>next</code>",
        "<code>iterable</code>"
    ]
}'></div>

----

### Генератор

```typescript
function* myGenerator(){
    let count=0
    while(count<5)
        yield count++
}

for(let n of myGenerator())
    console.log(n)
```

<small>[конфигурация компилятора](tsconfig.json)<small>

---

### Интерфейс генератора

```typescript
interface Generator<T = unknown, TReturn = any, TNext = unknown>
    extends Iterator<T, TReturn, TNext> {
    next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
    return(value: TReturn): IteratorResult<T, TReturn>;
    throw(e: any): IteratorResult<T, TReturn>;
    [Symbol.iterator](): Generator<T, TReturn, TNext>;
}
```

---

### Пример генератора

```typescript
function* getFibonaccy() {
  let prevDigit = 0, nextDigit = 1;
  yield prevDigit; 
  do {
    yield nextDigit;
	[prevDigit, nextDigit] = [nextDigit, nextDigit + prevDigit];
  } while(true);
}
```

---

<div class='quiz' data-quiz='{ 
    "question": "Как правильно записать генератор?",    
    "right": [ 
        "<code>function* myGenerator(){...}</code>"
    ],
    "wrong": [
        "<code>function myGenerator(){...}</code>",
        "<code>function myGenerator*(){...}</code>",
        "<code>*function myGenerator(){...}</code>"
    ]
}'></div>

---

<div class='quiz' data-quiz='{ 
    "question": "Как правильно перебрать элементы генератора?",    
    "right": [ 
        "<code>for(let n of myGenerator())</code>"        
    ],
    "wrong": [
        "<code>for(let n in myGenerator())</code>",
        "<code>for(myGenerator())</code>",
        "<code>myGenerator().for(...)</code>"
    ]
}'></div>

----

### Итерация по ключам

```typescript
let list = [4, 5, 6];
for (let i in list) {
  console.log(i); // "0", "1", "2",
}
for (let i of list) {
  console.log(i); // 4, 5, 6
}
```

---

### Итераторы в массиве

```typescript
interface Array<T> {
    [Symbol.iterator](): IterableIterator<T>;
    entries(): IterableIterator<[number, T]>;
    keys(): IterableIterator<number>;
    values(): IterableIterator<T>;
}
```

---

### Карты

```typescript
interface Map<K, V> {
    [Symbol.iterator](): IterableIterator<[K, V]>;
    entries(): IterableIterator<[K, V]>;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
}
```

---

### Множества

```typescript
interface Set<T> {
    [Symbol.iterator](): IterableIterator<T>;
    entries(): IterableIterator<[T, T]>;
    keys(): IterableIterator<T>;
    values(): IterableIterator<T>;
}
```


---

<div class='quiz' data-quiz='{ 
    "question": "Какой итератор является основным в коллекции Array?",    
    "right": [ 
        "<code>values</code>"
    ],
    "wrong": [
        "<code>entries</code>",
        "<code>keys</code>",
        "<code>map</code>"
    ]
}'></div>

---

<div class='quiz' data-quiz='{ 
    "question": "Какой итератор является основным в коллекции Map?",    
    "right": [ 
        "<code>entries</code>"
    ],
    "wrong": [
        "<code>values</code>",
        "<code>keys</code>",
        "<code>map</code>"
    ]
}'></div>