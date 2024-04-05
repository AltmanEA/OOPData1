### Классы 

```typescript
class Student {
    _id: ObjectId = new ObjectId()
    constructor(
        public name: string,
        public group: string ) { } }
class Grade { constructor(
        public studentId: ObjectId,
        public studentName: String,
        public value?: number,
        public date?: Date  ) { } }
class Course { constructor(
        public name: string,
        public grades: Array<Grade> = []
    ) { } }
```

---

### Запуск фреймворка

```typescript
console.log(await course_col.aggregate([
    {
        $match: { "name": "Чтение" }
    }
]).toArray())
```
```
[
  {
    _id: new ObjectId('660e97839b3f67740baf4fd0'),
    name: 'Чтение',
    grades: [ [Object], [Object], [Object], [Object], [Object] ]
  }
]
```

---

### Операция unwind

```typescript
console.log(await course_col.aggregate([
    {
        $unwind: "$grades"
    }
]).toArray())
```
```
[
  { _id: new ObjectId('660e987f2b0a5cc234ce1f34'),
    name: 'Математика',
    grades: {
      studentId: new ObjectId('660e987f2b0a5cc234ce1f2f'),
      studentName: 'Маша',
      value: 4,
      date: 2024-04-04T12:09:35.924Z } },
  { _id: new ObjectId('660e987f2b0a5cc234ce1f34'),
    name: 'Математика',
    grades: {
      studentId: new ObjectId('660e987f2b0a5cc234ce1f30'),
      studentName: 'Даша',
      value: 4,
      date: 2024-04-04T12:09:35.924Z } },
  { _id: new ObjectId('660e987f2b0a5cc234ce1f34'),
  ... ]
```

---

### Получаем оценки студента

```typescript
console.log(await course_col.aggregate([
    { $unwind: "$grades" }, 
    { $match: { "grades.studentName": "Маша" } }
]).toArray())
```
```
[{   _id: new ObjectId('660e99854181b942fa0c0b7c'),
    name: 'Математика',
    grades: {
      studentId: new ObjectId('660e99854181b942fa0c0b77'),
      studentName: 'Маша',
      value: 4,
      date: 2024-04-04T12:13:57.567Z } },
{   _id: new ObjectId('660e99854181b942fa0c0b7d'),
    name: 'Чтение',
    grades: {
      studentId: new ObjectId('660e99854181b942fa0c0b77'),
      studentName: 'Маша',
      value: 5,
      date: 2024-04-04T12:13:57.591Z } },
  ... ]
```

----

### Проекция

```typescript
console.log(await course_col.aggregate([
    {   $unwind: "$grades" }, 
    {   $match: { "grades.studentName": "Маша" } }, 
    {   $project: {
            _id: 0,
            name: 1,
            value: "$grades.value",
            date: "$grades.date" } }
    ]).toArray())
```
```
[
  { name: 'Математика', value: 4, date: 2024-04-04T12:17:56.895Z },
  { name: 'Чтение', value: 5, date: 2024-04-04T12:17:56.921Z },
  { name: 'Рус.яз', value: 4, date: 2024-04-04T12:17:56.895Z },
  { name: 'Окр. мир', value: 4, date: 2024-04-04T12:17:56.895Z }
]
```

---

### Дополнительные функции

```typescript
console.log(await course_col.aggregate([
    {   $unwind: "$grades" }, 
    {   $match: { "grades.studentName": "Маша" } }, 
    {   $project: {
            _id: 0,
            name: 1,
            value: "$grades.value",
            date: "$grades.date" } },
    {   $sort: { value: -1 } }, 
    {   $limit: 2 }
    ]).toArray())
```
```
[
  { name: 'Чтение', value: 5, date: 2024-04-04T12:25:02.698Z },
  { name: 'Математика', value: 4, date: 2024-04-04T12:25:02.669Z }
]
```

---

### Группировка

```typescript
console.log(await course_col.aggregate([
  { $unwind: "$grades" }, 
  { $group: {
    _id: "$grades.studentName",
    "Sum": { $sum: "$grades.value" } } }
]).toArray())
```
```
[
  { _id: 'Коля', Sum: 16 },
  { _id: 'Маша', Sum: 17 },
  { _id: 'Даша', Sum: 16 },
  { _id: 'Вася', Sum: 16 },
  { _id: 'Петя', Sum: 16 }
]
```

