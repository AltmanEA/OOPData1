0. Повторите примеры из лекций

---

1. Создайте класс ```DayIterable```, который реализует интерфейс ```Iterable``` и выдает по очереди дни недели. Следующий код:

```typescript
let i = 0;
for (let day of new DayIterable()) {
    if (i++ > 10) break
    process.stdout.write(`${day} `)
}
```

должен выдать такой результат:

```
Пн Вт Ср Чт Пт Сб Вс Пн Вт Ср Чт
```

---

2. Используя функцию ```map``` создайте константу ```studentWithIndexes``` тип которой ```[number, Student][]```. При выводе в терминал эта константа должна выглядеть так:

```
[
  [ 0, Student { name: 'Sheldon' } ],
  [ 1, Student { name: 'Leonard' } ],
  [ 2, Student { name: 'Howard' } ],
  [ 3, Student { name: 'Raj' } ],
  [ 4, Student { name: 'Penny' } ],
  [ 5, Student { name: 'Amy' } ],
  [ 6, Student { name: 'Bernadette' } ]
]
``` 

---

3. Используя функцию ```reduce``` посчитайте число студентов с оценкой 4 в массиве ```grades```

---

4. Создайте множество значений (```value```) оценок в массиве ```grades```:

```
Set(3) { 5, 4, 3 }
```

---

5. Создайте карту ключами которой является значения оценок в массиве ```grades```, а значениями - массив из студентов, получивших такие оценки:

```
Map(3) {
  5 => [ Student { name: 'Sheldon' } ],
  4 => [ Student { name: 'Leonard' }, Student { name: 'Howard' } ],
  3 => [ Student { name: 'Raj' } ]
}
```
