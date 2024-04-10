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

---

<div class='quiz' data-quiz='{
    "question": "Что используется для связи с документами другой коллекции в MongoDB?",
    "right": [
      "идентификатор"
    ],
    "wrong": [
      "ссылка",
      "ключ",
      "url"
    ]
  }'></div>


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

---

<div class='quiz' data-quiz='{
    "question": "Как правильно создать запрос на выборку объектов в MongoDB, отвечающим двум условиям?",
    "right": [
      "<code>$and: [ { x: 1 }, { y: 2 } ]</code>"
    ],
    "wrong": [
      "<code>{ x: 1 } $and { y: 2 }</code>",
      "<code>$and: { { x: 1 }, { y: 2 } }</code>",
      "<code>$and: { x: 1, y: 2 }</code>"
    ]
  }'></div>

---

<div class='quiz' data-quiz='{
    "question": "Как правильно обратиться к вложенному объекту в MongoDB?",
    "right": [
      "<code>{ \"x.y\": 1 }</code>"
    ],
    "wrong": [
      "<code>{ x: { y: 1 }}</code>",
      "<code>$and: { { x: 1 }, { y: 2 } }</code>",
      "<code>$and: { x: 1, y: 2 }</code>"
    ]
  }'></div>


---

<div class='quiz' data-quiz='{
    "question": "Как правильно обновить два поля в  MongoDB?",
    "right": [
      "<code>$set: { \"grades.$.value\": value, \"grades.$.date\": date }</code>"
    ],
    "wrong": [
      "<code>$set: [ \"grades.$.value\": value, \"grades.$.date\": date ]</code>",
      "<code>{ $set: \"grades.$.value\": value, $set: \"grades.$.date\": date }</code>",
      "выполнить два запроса"
    ]
  }'></div>

---

<div class='quiz' data-quiz='{
    "question": "В какую позицию вставляет значение позиционный оператор <code>$</code> в MongoDB?",
    "right": [
      "найденную в запросе на обновление"
    ],
    "wrong": [
      "добавляет в конец массива",
      "добавляет в начало массива",
      "изменяет все элементы массива"
    ]
  }'></div>


----

### Оператор ```in```

The  [$in](https://www.mongodb.com/docs/manual/reference/operator/query/in/) operator selects the documents where the value of a field equals any value in the specified array.


---

### Оператор ```push```

The [$push](https://www.mongodb.com/docs/manual/reference/operator/update/push/) operator appends a specified value to an array.

---

### Оператор ```$[]```

The all positional operator [$[]](https://www.mongodb.com/docs/manual/reference/operator/update/positional-all/) indicates that the update operator should modify all elements in the specified array field.

---

<div class='quiz' data-quiz='{
    "question": "В какую позицию вставляет значение оператор <code>$[]</code> в MongoDB?",
    "right": [
      "изменяет все элементы массива"
    ],
    "wrong": [
      "найденную в запросе на обновление",
      "добавляет в конец массива",
      "добавляет в начало массива"
    ]
  }'></div>
  
---

<div class='quiz' data-quiz='{
    "question": "В какую позицию вставляет значение оператор <code>$push</code> в MongoDB?",
    "right": [
      "добавляет в конец массива"
    ],
    "wrong": [
      "изменяет все элементы массива",
      "найденную в запросе на обновление",
      "добавляет в начало массива"
    ]
  }'></div>