### Сериализация

```typescript
class SerialStudent {
    constructor(
        public firstname: string,
        public surname: string
    ) { }
    get fullname() {
        return `${this.firstname} ${this.surname}` } }
class SerialLesson {
    constructor(
        public name: string,
        students: SerialStudent[] = []
    ) { this.students = students}
    students: SerialStudent[] }
```

---

### JSON

JavaScript Object Notation

```JSON
{
  "name": "Математика",
  "students": [
    {
      "firstname": "Александр",
      "surname": "Пушкин"
    }
  ]
}
```

---

### XML

eXtensible Markup Language

```XML
<?xml version="1.0" encoding="UTF-8" ?>
<lesson>
	<name>Математика</name>
	<students id="1">
		<firstname>Александр</firstname>
		<surname>Пушкин</surname>
	</students>
</lesson>
```

---

### YAML

YAML Ain't Markup Language

```YAML
lesson:
  name: Математика
  students:
    firstname: Александр
    surname: Пушкин
```

---

<div class='quiz' data-quiz='{ 
    "question": "Каким образом задается вложенный объект в нотации JSON?",
    "right": [
      "<code>{...}</code>"
    ],
    "wrong": [
      "<code>< xxx >...< /xxx ></code>",
      "<code>отступ на позицию вправо</code>",
      "<code>[...]</code>"
    ]
}'></div>


---

<div class='quiz' data-quiz='{ 
    "question": "Каким образом задается вложенный объект в нотации XML?",
    "right": [
      "<code>< xxx >...< /xxx ></code>"
    ],
    "wrong": [
      "<code>{...}</code>",
      "<code>отступ на позицию вправо</code>",
      "<code>[...]</code>"
    ]
}'></div>

---

<div class='quiz' data-quiz='{     
    "question": "Каким образом задается вложенный объект в нотации YAML?",
    "right": [
      "<code>отступ на позицию вправо</code>"
    ],
    "wrong": [
      "<code>{...}</code>",
      "<code>< xxx >...< /xxx ></code>",
      "<code>[...]</code>"
    ]
}'></div>

----

### Простой объект

```typescript
const pushkin = new SerialStudent("Александр", "Пушкин")
const pushkin_json = JSON.stringify(pushkin)
const pushkin_plain = JSON.parse(pushkin_json) as SerialStudent
console.log(pushkin_plain.fullname)
```
```
undefined
```

---

### Добавление методов из прототипа

```typescript
const pushkin = new SerialStudent("Александр", "Пушкин")
const pushkin_json = JSON.stringify(pushkin)
const pushkin_plain = JSON.parse(pushkin_json) as SerialStudent
console.log(pushkin_plain.fullname)
const pushkin_obj = Object.assign(
    new SerialStudent("", ""), pushkin_plain)
console.log(pushkin_obj.fullname)
```
```
undefined
Александр Пушкин
```

---

### Библиотека сериализации

```typescript
import { plainToInstance } from "class-transformer"
import "reflect-metadata"

const pushkin = new SerialStudent("Александр", "Пушкин")
const pushkin_json = JSON.stringify(pushkin)
const pushkin_plain = JSON.parse(pushkin_json) as SerialStudent
console.log(pushkin_plain.fullname)
const pushkin_obj = Object.assign(
    new SerialStudent("", ""), pushkin_plain)
console.log(pushkin_obj.fullname)
const pushkin_class = plainToInstance(
    SerialStudent, pushkin_plain)
console.log(pushkin_class.fullname)
```
```
undefined
Александр Пушкин
Александр Пушкин
```

---

<div class='quiz' data-quiz='{     
    "question": "Какая из перечисленных функций возвращает JSON объект?",
    "right": [
      "<code>JSON.parse</code>"
    ],
    "wrong": [
      "<code>Object.assign</code>",
      "<code>JSON.stringify</code>",
      "<code>plainToInstance</code>"
    ]
}'></div>


---

<div class='quiz' data-quiz='{     
    "question": "Какая из перечисленных функций возвращает объект с методами?",
    "right": [
      "<code>Object.assign</code>",
      "<code>plainToInstance</code>"
    ],
    "wrong": [
      "<code>JSON.parse</code>",
      "<code>JSON.stringify</code>"
    ]
}'></div>

---

<div class='quiz' data-quiz='{     
    "question": "Какая из перечисленных функций возвращает строку в формате JSON?",
    "right": [
      "<code>JSON.stringify</code>"
    ],
    "wrong": [
      "<code>Object.assign</code>",
      "<code>JSON.parse</code>",
      "<code>plainToInstance</code>"
    ]
}'></div>

----

### Вложенные объекты

```typescript
const math = new SerialLesson("Математика", [pushkin_class])
const math_json = JSON.stringify(math)
console.log(math_json)
const math_plain = JSON.parse(math_json) as SerialLesson
console.log(math_plain.students[0].fullname)
const math_obj = Object.assign(new SerialLesson(""), math_plain)
console.log(math_obj.students[0].fullname)
const math_class = plainToInstance(SerialLesson, math_plain)
console.log(math_class.students[0].fullname)
```
```
{ "name":"Математика",
  "students":[{"firstname":"Александр","surname":"Пушкин"}]}
undefined
undefined
undefined
```

---

### Указываем класс

```typescript
import { Type, plainToInstance } from "class-transformer"
import "reflect-metadata"

class SerialLesson {
    constructor(
        public name: string,
        students: SerialStudent[] = []
    ) {
        this.students = students
    }

    @Type(() => SerialStudent)
    students: SerialStudent[]
}
```

---

### Сериализация с указанием класса

```typescript
const math = new SerialLesson("Математика", [pushkin_class])
const math_json = JSON.stringify(math)
console.log(math_json)
const math_plain = JSON.parse(math_json) as SerialLesson
console.log(math_plain.students[0].fullname)
const math_obj = Object.assign(new SerialLesson(""), math_plain)
console.log(math_obj.students[0].fullname)
const math_class = plainToInstance(SerialLesson, math_plain)
console.log(math_class.students[0].fullname)
```
```
{ "name":"Математика",
  "students":[{"firstname":"Александр","surname":"Пушкин"}]}
undefined
undefined
Александр Пушкин
```

---

<div class='quiz' data-quiz='{     
    "question": "Перед чем записывается декоратор <code>Type</code> библиотеки <code>class-transformer</code>?",
    "right": [
      "перед вложенными объектами класса"
    ],
    "wrong": [
      "перед классом с вложенными объектами",
      "перед методом<code>JSON.parse</code>",
      "перед методом <code>plainToInstance</code>"
    ]
}'></div>

---

<div class='quiz' data-quiz='{     
    "question": "Какая из перечисленных функций возвращает объект с методами, в том числе и для вложенных объектов?",
    "right": [
      "<code>plainToInstance</code>"
    ],
    "wrong": [
      "<code>Object.assign</code>",
      "<code>JSON.parse</code>",
      "<code>JSON.stringify</code>"
    ]
}'></div>

----

### Полиморфная сериализация 

```typescript
abstract class Person{}
class PersonTutor extends Person {
    constructor(public name: string) { super() }
    get fullname(){ return `Проф. ${this.name}`} }
class PersonStudent extends Person{
    constructor( public firstname: string,
        public surname: string ) { super() }
    get fullname() { return `${this.firstname} ${this.surname}`}
}
class PassCard {
    person: Person
    constructor(person: Person){
        this.person = person } }
```

---

### Информация о типе объекта

```typescript
abstract class Person{
    abstract _type: string
}
class PersonTutor extends Person {
    override _type: string = "tutor"
    ... }
class PersonStudent extends Person{
    override _type: string = "student"
    ... }
```

---

### Настройка сериализации

```typescript
class PassCard {
    @Type(() => Person, {
        discriminator: {
property: '_type',
subTypes: [
    { value: PersonStudent, name: 'student' },
    { value: PersonTutor, name: 'tutor' },
]
        } 
    })
    person: Person
    constructor(person: Person){
        this.person = person} }
```

---

### Полиморфная сериализация

```typescript
const card = new PassCard(new PersonTutor("Эйлер"))
const card_json = JSON.stringify(card)
console.log(card_json)
const card_plain = JSON.parse(card_json) as PassCard
console.log((card_plain.person as PersonTutor).fullname)
const card_class = plainToInstance(PassCard, card_plain)
console.log(card_class)
console.log((card_class.person as PersonTutor).fullname)
console.log((card_class.person as PersonStudent).fullname)
```
```
{"person":{"name":"Эйлер","_type":"tutor"}}
undefined
PassCard { person: PersonTutor { name: 'Эйлер', _type: 'tutor' } }
Проф. Эйлер
Проф. Эйлер
```

---

<div class='quiz' data-quiz='{     
    "question": "Какие свойства нужно задать дискриминатору при полиморфной сериализации?",
    "right": [
      "<code>property</code>",
      "<code>subTypes</code>"
    ],
    "wrong": [
      "<code>type</code>",
      "<code>abstract</code>"
    ]
}'></div>
