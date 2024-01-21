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

----

