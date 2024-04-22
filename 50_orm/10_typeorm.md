### Контейнер базы данных

```docker-compose.yml```
```YAML
version: '3'
services:
  db:
    image: mysql:latest
    container_name: db
    environment:
      MYSQL_ROOT_PASSWORD: pass
      MYSQL_DATABASE: app_db
      MYSQL_USER: test
      MYSQL_PASSWORD: test
    ports:
      - "3306:3306"
    volumes:
      - dbdata:/var/lib/mysql
```      

---

### Контейнер администрирования

```docker-compose.yml```
```YAML
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: pma
    links:
      - db
    environment:
      PMA_HOST: db
      PMA_PORT: 3306
      PMA_ARBITRARY: 1
    restart: always
    ports:
      - 8081:80
```     

---

### Библиотеки

```docker-compose.yml```
```javascript
   "dependencies": {
      "mysql2": "^3.9.4",
      "reflect-metadata": "^0.1.13",
      "typeorm": "0.3.20"
   },
``` 

---

### Коннектор

```docker-compose.yml```
```typescript
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: true,
    entities: [Student, Grade, Course],
    migrations: [],
    subscribers: [],
})
```

---

### Подключение

```docker-compose.yml```
```typescript
AppDataSource.initialize().then(async () => {

    ...

}).catch(error => console.log(error))
``` 

----

### Класс student

```typescript
@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id?: number
    @Column()
    name: string
    @Column()
    group: string
    @OneToMany(() => Grade, grade => grade.course)
    grades: Grade[]
    constructor(name: string, group: string) {        
        this.name = name
        this.group = group     } }
``` 

---

### Класс Course

```typescript
@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id?: number
    @Column()
    name: string
    @OneToMany(() => Grade, grade => grade.course, {eager: true})
    grades: Grade[]
    constructor(name: string) {
        this.name = name   } }
``` 

---

### Класс Grade

```typescript
@Entity()
export class Grade {
    @PrimaryGeneratedColumn()
    id?: number
    @Column("tinyint")
    value: number
    @Column("datetime")
    date: Date
    @ManyToOne(() => Student, student => student.grades,  {
        onDelete: "CASCADE"
    })    
    student: Student
    @ManyToOne(() => Course, course => course.grades)
    course: Course
    constructor( value: number, student: Student,
        course: Course, date?: Date ) { } }
``` 

----

### Низкоуровневые запросы

```typescript
const queryRunner = AppDataSource.createQueryRunner()
await queryRunner.connect()
await queryRunner.query("SET FOREIGN_KEY_CHECKS = 0")
await queryRunner.query("TRUNCATE TABLE student")
await queryRunner.query("TRUNCATE TABLE grade")
await queryRunner.query("TRUNCATE TABLE course")
await queryRunner.query("SET FOREIGN_KEY_CHECKS = 1")
await queryRunner.release()
``` 

---

### Репозиторий. Вставка

```typescript
const studentRepo = AppDataSource.getRepository(Student)
const gradeRepo = AppDataSource.getRepository(Grade)
const courseRepo = AppDataSource.getRepository(Course)
   
const students = ["Маша", "Даша"].map(s => new Student(s, "21"))
  .concat(["Вася", "Петя", "Коля"].map(s => new Student(s, "22")))
await studentRepo.insert(students)
``` 

```
INSERT INTO `student`(`id`, `name`, `group`) VALUES (DEFAULT, ?, ?), 
(DEFAULT, ?, ?), (DEFAULT, ?, ?), (DEFAULT, ?, ?), (DEFAULT, ?, ?) 
-- PARAMETERS: ["Маша","21","Даша","21","Вася","22","Петя","22","Коля","22"]
```

---

### Репозиторий. Вставка

```typescript
const courses = ["Математика", "Чтение", "Рус.яз", "Окр. мир"]
  .map(s => new Course(s))
await courseRepo.insert(courses)
console.log(courses)
``` 

```
INSERT INTO `course`(`id`, `name`) VALUES (DEFAULT, ?), 
(DEFAULT, ?), (DEFAULT, ?), (DEFAULT, ?) 
-- PARAMETERS: ["Математика","Чтение","Рус.яз","Окр. мир"]
```

```JSON
[
  Course { name: 'Математика', id: 1 },
  Course { name: 'Чтение', id: 2 },
  Course { name: 'Рус.яз', id: 3 },
  Course { name: 'Окр. мир', id: 4 }
]
```

---

### Репозиторий. Вставка

```typescript
const grades = students.map(s => new Grade(4, s, courses[0]))
  .concat(students.map(s => new Grade(5, s, courses[1])))
await gradeRepo.insert(grades)
console.log(grades)
``` 

```
 INSERT INTO `grade`(`id`, `value`, `date`, `studentId`, `courseId`)
 VALUES (DEFAULT, ?, ?, ?, ?), // 10 раз 
 -- PARAMETERS: [4,"2024-04-22T04:24:34.067Z",1,1, // 10 групп.
```

```JSON
[
  Grade {
    value: 4,
    date: 2024-04-22T04:24:34.067Z,
    student: Student { name: 'Маша', group: '21', id: 1 },
    course: Course { name: 'Математика', id: 1 },
    id: 1
  },
```

----

### Чтение данных

```typescript
console.dir(await studentRepo.find(), { depth: null })
``` 

```
SELECT `Student`.`id` AS `Student_id`, 
`Student`.`name` AS `Student_name`,
`Student`.`group` AS `Student_group` FROM `student` `Student`
```

```JSON
[
  Student { name: 'Маша', group: '21', id: 1 },
  Student { name: 'Даша', group: '21', id: 2 },
  Student { name: 'Вася', group: '22', id: 3 },
  Student { name: 'Петя', group: '22', id: 4 },
  Student { name: 'Коля', group: '22', id: 5 }
]
```

---

### Чтение данных

```typescript
console.dir(await courseRepo.find(), { depth: null })
``` 

```
SELECT `Course`.`id` AS `Course_id`, 
`Course`.`name` AS `Course_name`,
`Course__grades`.`id` AS `Course__grades_id`, 
`Course__grades`.`value` AS `Course__grades_value`, // ...
FROM `course` `Course` LEFT JOIN `grade` `Course__grades` 
ON `Course__grades`.`courseId`=`Course`.`id`
```

```JSON
[
  Course {
    name: 'Математика',
    id: 1,
    grades: [
      Grade {
        value: 4,
        date: 2024-04-22T04:39:15.000Z,
        student: undefined,
        course: undefined,
        id: 1
      },
```

---

### Чтение данных

```typescript
console.dir(await studentRepo.find(
  { where: { group: "21" },
    relations: { grades: true } }
), { depth: null })
``` 

```
SELECT `Student`.`id` AS `Student_id`, // ...
FROM `student` `Student` LEFT JOIN `grade` `Student__Student_grades` 
ON `Student__Student_grades`.`courseId`=`Student`.`id` 
WHERE ((`Student`.`group` = ?)) -- PARAMETERS: ["21"]
```

```JSON
[
  Student {
    name: 'Маша',
    group: '21',
    id: 1,
    grades: [
      Grade {
        value: 4,
        date: 2024-04-22T04:51:39.000Z,
```

----

### Обновление

```typescript
await studentRepo.update(
  { name: "Маша" },
  { name: "Мария" })
console.log(students)
console.log(await studentRepo.find())
``` 

```
query: UPDATE `student` SET `name` = ? WHERE `name` = ? 
-- PARAMETERS: ["Мария","Маша"]
[
  Student { name: 'Маша', group: '21', id: 1 },
...
query: SELECT `Student`.`id` AS `Student_id`, 
`Student`.`name` AS `Student_name`, 
`Student`.`group` AS `Student_group` FROM `student` `Student`
[
  Student { name: 'Мария', group: '21', id: 1 },
```

---

### Удаление

```typescript
await courseRepo.delete({ 
  name: "Математика"
})
``` 

```
query failed: DELETE FROM `course` WHERE `name` = ? 
-- PARAMETERS: ["Математика"]
error: Error: Cannot delete or update a parent row: 
  a foreign key constraint fails
```

---

### Удаление

```typescript
await studentRepo.delete({ 
  name: "Мария"
})
console.log(students)
console.log(await studentRepo.find())
``` 

```
query: DELETE FROM `student` WHERE `name` = 
  ? -- PARAMETERS: ["Мария"]
[
  Student { name: 'Маша', group: '21', id: 1 },
  Student { name: 'Даша', group: '21', id: 2 },
...  
query: SELECT `Student`.`id` AS `Student_id`, `Student`.`name` 
AS `Student_name`, `Student`.`group` AS `Student_group` 
FROM `student` `Student`
[
  Student { name: 'Даша', group: '21', id: 2 },
```