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

### Коллекции

```typescript
const students_col = db.collection(STUDENT_COLLECTION) 
    as Collection<Student>
const course_col = db.collection(COURSE_COLLECTION) 
    as Collection<Course>
```

---

### Вставка

```typescript
const student = new Student("Маша", "22а")
console.log("Обычный объект", student)
await students_col.insertOne(student)
console.log("Объект из БД")
console.log(await students_col.find().toArray())
```
```
Обычный объект Student {
  name: 'Маша',
  group: '22а',
  _id: new ObjectId('65f3dc28c1226ee5d854aafb')
}
Объект из БД
[
  {
    _id: new ObjectId('65f3dc28c1226ee5d854aafb'),
    name: 'Маша',
    group: '22а'
  }
]
```

----

### Тестовые данные

```typescript
const students = ["Маша", "Даша"]
    .map(s => new Student(s, "22а"))
    .concat(["Вася", "Петя", "Коля"]
        .map(s => new Student(s, "22б")))
await students_col.insertMany(students)
const students_db = await students_col.find().toArray()

const courses = ["Математика", "Чтение", "Рус.яз"]
    .map(s => new Course(s,
        students_db.map(s => new Grade(s._id, s.name))))
await course_col.insertMany(courses)
const courses_db = await course_col.find().toArray()
```

---

### Изменение оценки

```typescript
async function setGrades(
    collection: Collection<Course>,
    courseName: string,
    studentName: string,
    value: number, 
    date: Date = new Date()
) {
    ...
}
```


---

### Логический оператор

```typescript
await collection.updateOne(
    {
        $and: [
            { name: courseName },
            { 'grades.studentName': studentName }
        ]
    },
    {
        $set: {
            'grades.$.value': value,
            'grades.$.date': date
        }
    }
)
```

---

### Позиционный оператор

```typescript
await collection.updateOne(
    {
        $and: [
            { name: courseName },
            { 'grades.studentName': studentName }
        ]
    },
    {
        $set: {
            'grades.$.value': value,
            'grades.$.date': date
        }
    }
)
```

----

### Оператор ```in```

The  [$in](https://www.mongodb.com/docs/manual/reference/operator/query/in/) operator selects the documents where the value of a field equals any value in the specified array.


---

### Оператор ```push```

The [$push](https://www.mongodb.com/docs/manual/reference/operator/update/push/) operator appends a specified value to an array.

---

### Оператор ```$[]```

The all positional operator [$[]](https://www.mongodb.com/docs/manual/reference/operator/update/positional-all/) indicates that the update operator should modify all elements in the specified array field.