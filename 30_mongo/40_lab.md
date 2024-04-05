0. Повторите примеры из лекций

---

<small>1.  Создайте коллекцию для</small>

```typescript
class Count {
    constructor(
        public name: string,
        public value: number = 0
    ) { }
}
```
<small>Добавьте в коллекцию счетчики "Tables", "Figures", "Equations".</small>
<small>Изучите оператор inc и реализуйте функцию, увеличивающую счетчик на единицу:</small>

```typescript
async function incCount(name: string) {}
```

<small>Протестируйте ее:</small>

```typescript
await incCount("Tables")
await incCount("Tables")
await incCount("Equations")
await incCount("Listings")
```

---

<small>2.  Реализуйте функцию, которая в случае, если счетчика нет – создает его, если счетчик уже есть – увеличивает его на 1:</small>

```typescript
async function incOrCreateCount(name: string) {}
```

<small>Протестируйте ее:</small>

```typescript
await incOrCreateCount("Tables")
await incOrCreateCount("Listings")
await incOrCreateCount("Listings")
```

---

<small>3.  выполните запрос и выведите на экран счетчики, значение которых: больше 0; больше или равно 1 и меньше или равно 2.</small>

---

<small>4. Напишите функцию, увеличивающую на единицу оценку студента:</small>

```typescript
async function incGrade(
    course: string,
    studentName: string
) {}
```

<small>Протестируйте ее:</small>

```typescript
await setGrade(course_col, "Математика", "Маша", 5)
await setGrade(course_col, "Математика", "Даша", 6)
await incGrade("Математика", "Маша")
await incGrade("Математика", "Вася")
```

---

<small>5. Реализуйте функцию, которая добавляет студента в список студентов и записывает его на курсы:</small>

```typescript
async function addStudent(
    name: string, 
    group: string, 
    courses: string[]
) {}
```

<small>Протестируйте ее:</small>

```typescript
await addStudent("Антон", "22а", ["Математика", "Рус.яз"])
```

---

<small>6. Реализуйте функцию, выставляющую одну оценку всем студентам на курсе:</small>

```typescript
async function setAllValue (
    course: string,
    value: number
){}
```

<small>Протестируйте ее:</small>

```typescript
await setAllValue("Математика", 4)
```