### Prisma

- ORM
- Data model language
- Type generator
- Dev tools

---

### Библиотеки

```package.json```
```JSON
  "devDependencies": {
    "@types/node": "^20.12.7",
    "prisma": "^5.12.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.5"
  },
  "dependencies": {
    "@prisma/client": "^5.12.1"
  }
  ```      

---

### Создание проекта

```
npx prisma init --datasource-provider sqlite
```

```schema.prisma```
```JSON
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
...
```   

----

### Моделирование

```schema.prisma```
```JSON
model Student {
  id    Int     @id @default(autoincrement())  
  name  String
  group String
  grade Grade[]
}

model Course {
  id        Int     @id @default(autoincrement())
  title     String
  grade     Grade[]
}
```

---

### Моделирование

```schema.prisma```
```JSON
model Grade {
  id        Int     @id @default(autoincrement())
  value     Int
  date      DateTime 
  student   Student @relation(fields: [studentId], references: [id])
  studentId Int
  course    Course  @relation(fields: [courseId], references: [id])
  courseId  Int
}
```

---

### Миграция


```
npx prisma migrate dev --name init
```

- настройка базы данных
- генерация кода для prisma-client

----

### Клиент

```Typescript
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })
```

---

### Запуск

```Typescript
async function main(): Promise<void> { ... }

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
```

---

### Очистка таблиц

```Typescript    
    await prisma.student.deleteMany()
    await prisma.course.deleteMany()
    await prisma.grade.deleteMany()
    ??? 
    await prisma.grade.deleteMany()
    await prisma.student.deleteMany()
    await prisma.course.deleteMany()
```

----

### Создание записей

```Typescript    
await prisma.student.createMany({ 
    data: [ {name: "Маша", group: "21"},
            {name: "Даша", group: "21"},
            {name: "Вася", group: "22"},
            {name: "Петя", group: "22"},
            {name: "Коля", group: "22"}, ] })
await prisma.course.createMany({ 
    data: [ {title: "Математика"},
            {title: "Чтение"},
            {title: "Рус.яз"},
            {title: "Окр. мир"}, ] })
```

---

### Создание записей

```Typescript    
(method) Prisma.StudentDelegate<DefaultArgs>.createMany<{
    data: {
        name: string;
        group: string;
    }[];
}>(args?: {
    data: {
        name: string;
        group: string;
    }[];
} | undefined): Prisma.PrismaPromise<Prisma.BatchPayload>
Create many Students.
```

---

### Создание записей

```Typescript    
prisma:query BEGIN
prisma:query INSERT INTO `main`.`Student` (`group`, `name`) 
    VALUES (?,?), (?,?), (?,?), (?,?), (?,?)
prisma:query COMMIT
prisma:query BEGIN
prisma:query INSERT INTO `main`.`Course` (`title`) 
    VALUES (?), (?), (?), (?)
prisma:query COMMIT
```

---

### Создание записей

```Typescript    
const students_db = await prisma.student.findMany()
const courses_db = await prisma.course.findMany()
const grades_data = students_db.map(s => {
        return {value: 4, date: new Date(), 
            studentId: s.id, courseId: courses_db[0].id}
    }).concat(students_db.map(s => {
        return {value: 5, date: new Date(), 
            studentId: s.id, courseId: courses_db[1].id}
}))
await prisma.grade.createMany({ 
    data: grades_data
})
```

---

### Создание записей

```Typescript    
prisma:query SELECT `main`.`Student`.`id`, 
    `main`.`Student`.`name`, `main`.`Student`.`group` 
    FROM `main`.`Student` WHERE 1=1 LIMIT ? OFFSET ?
prisma:query SELECT `main`.`Course`.`id`, `main`.`Course`.`title` 
    FROM `main`.`Course` WHERE 1=1 LIMIT ? OFFSET ?
prisma:query BEGIN
prisma:query INSERT INTO `main`.`Grade` 
    (`date`, `courseId`, `studentId`, `value`) 
    VALUES (?,?,?,?), (?,?,?,?), (?,?,?,?), (?,?,?,?), (?,?,?,?), 
        (?,?,?,?), (?,?,?,?), (?,?,?,?), (?,?,?,?), (?,?,?,?)
prisma:query COMMIT
```

----

### Чтение

```Typescript    
const courses = await prisma.course.findMany({
    where: {
        title: "Математика" }, })
console.dir(courses, { depth: null })    
```
```
prisma:query SELECT `main`.`Course`.`id`, `main`.`Course`.`title` 
    FROM `main`.`Course` WHERE `main`.`Course`.`title` = ? 
    LIMIT ? OFFSET ?
[ { id: 49, title: 'Математика' } ]
```

---

### Eager чтение

```Typescript    
const students = await prisma.student.findMany({
    where: { name: "Маша" },
    include: { grade: true } })
console.dir(students, { depth: null })  
```
```
prisma:query SELECT `main`.`Student`.`id`, `main`.`Student`.`name`, `main`.`Student`.`group` FROM `main`.`Student` WHERE `main`.`Student`.`name` = ? LIMIT ? OFFSET ?
prisma:query SELECT `main`.`Grade`.`id`, `main`.`Grade`.`value`, `main`.`Grade`.`date`, `main`.`Grade`.`studentId`, `main`.`Grade`.`courseId` FROM `main`.`Grade` WHERE `main`.`Grade`.`studentId` IN (?) LIMIT ? OFFSET ?
[
  {
    id: 76,
    name: 'Маша',
    group: '21',
    grade: [
      {
        id: 86,
        value: 4,
```

---

### Тип результатов чтения

```Typescript    
const courses: {
    id: number;
    title: string;
}[]
```
```Typescript
const students: ({
    grade: {
        id: number;
        value: number;
        date: Date;
        studentId: number;
        courseId: number;
    }[];
} & {
    id: number;
    name: string;
    group: string;
})[]
```


