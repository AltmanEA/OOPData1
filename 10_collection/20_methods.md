### Пример

```typescript
class Student {
    constructor(
        public name: string
    ) { } }
class Group {
    constructor(
        public name: string,
        public students: Array<Student>
    ) { } }
class Grade {
    constructor(
        public student: Student,
        public value: number
    ) { } }
```
---

### Пример

```typescript
function p<T>(o: T): T {
    console.log(o)
    return o
}

const boys = p(["Sheldon", "Leonard", "Howard", "Raj"])
const girls = p(["Penny", "Amy", "Bernadette"])

const students_names = p(boys.concat(girls))
```
```
[ 'Sheldon', 'Leonard', 'Howard', 'Raj' ]
[ 'Penny', 'Amy', 'Bernadette' ]
[ 'Sheldon', 'Leonard', 'Howard', 'Raj', 'Penny', 'Amy', 'Bernadette' ]
```

---

### Трансформация

```typescript
const students_old: Student[] = [];
for(let s of students_names)
    students_old.push(new Student(s))
p(students_old)

const students = p(students_names.map(value => new Student(value)))
```
```
[
  Student { name: 'Sheldon' },
  Student { name: 'Leonard' },
  Student { name: 'Howard' },
  Student { name: 'Raj' },
  Student { name: 'Penny' },
  Student { name: 'Amy' },
  Student { name: 'Bernadette' }
]
```

---

### Функция map

```typescript
/**
* Calls a defined callback function on each element of an array,
*   and returns an array that contains the results.
* @param callbackfn A function that accepts up to three arguments. 
*   The map method calls the callbackfn function one time 
*   for each element in the array.
* @param thisArg An object to which the this keyword can refer 
*   in the callbackfn function. If thisArg is omitted, 
*   undefined is used as the this value.
*/
map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U, 
    thisArg?: any): U[];
```

---

<div class='quiz' data-quiz='{ 
    "question": "Какой тип возвращает функция <code>map< U >(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any)</code>?",    
    "right": [ 
        "<code>U[]</code>"
    ],
    "wrong": [
        "<code>U</code>",
        "<code>T</code>",
        "<code>T[]</code>"
    ]
}'></div>

---

<div class='quiz' data-quiz='{ 
    "question": "Что из перечисленного не является аргументом функции  <code>callbackfn</code> в функции <code>map</code>?",    
    "right": [ 
        "<code>thisArg</code>"
    ],
    "wrong": [
        "<code>value</code>",
        "<code>index</code>",
        "<code>array</code>"
    ]
}'></div>

----

### Фильтрация или отбор

```typescript
const boy_students = p(students.filter(
    value => boys.includes(value.name)))
const girl_students = p(students.filter(
    value => girls.includes(value.name)))
const groups = p([
    new Group("Boys", boy_students), 
    new Group("Girls", girl_students)])
```
```
[
  Group {
    name: 'Boys',
    students: [ [Student], [Student], [Student], [Student] ]
  },
  Group {
    name: 'Girls',
    students: [ [Student], [Student], [Student] ]
  }
]
```

---

### Функция filter

```typescript
/**
* Returns the elements of an array that meet the condition 
*   specified in a callback function.
* @param predicate A function that accepts up to three arguments. 
*   The filter method calls the predicate function one time 
*   for each element in the array.
* @param thisArg ... .
*/
filter(
    predicate: (value: T, index: number, array: T[]) => unknown, 
    thisArg?: any): T[];
```

---

### Функция filter

```typescript
filter<S extends T>(
    predicate: (value: T, index: number, array: T[]) => value is S, 
    thisArg?: any): S[];
```

---

<div class='quiz' data-quiz='{ 
    "question": "Какой тип возвращает функция <code>filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any)</code>?",    
    "right": [ 
        "<code>T[]</code>"
    ],
    "wrong": [
        "<code>unknown</code>",
        "<code>T</code>",
        "<code>any</code>"
    ]
}'></div>

---

<div class='quiz' data-quiz='{ 
    "question": "Какая из сигнатур функций может использовать для предиката?",    
    "right": [ 
        "<code>(value: T, index: number, array: T[]) => value is S</code>",
        "<code>(value: T, index: number, array: T[]) => unknown</code>"
    ],
    "wrong": [
        "<code>(value: T, index: number, array: T[]) => U</code>",
        "<code>(value: T, index: number, array: T[]) => T</code>"        
    ]
}'></div>

----

### Поиск 

```typescript
const grades = p([
    ["Sheldon", 5],
    ["Leonard", 4],
    ["Howard", 4],
    ["Raj", 3]
].map((value) => {
    const student_name = value[0]
    const student = students.find(
        value => value.name === student_name)
    return student ? new Grade(student, value[1] as number) : null
})) as Grade[]
```
```
[
  Grade { student: Student { name: 'Sheldon' }, value: 5 },
  Grade { student: Student { name: 'Leonard' }, value: 4 },
  Grade { student: Student { name: 'Howard' }, value: 4 },
  Grade { student: Student { name: 'Raj' }, value: 3 }
]
```

---

### Функция find

```typescript
/**
* Returns the value of the first element in the array 
*   where predicate is true, and undefined otherwise.
**/
find<S extends T>(
    predicate: (value: T, index: number, obj: T[]) => value is S, 
    thisArg?: any): S | undefined;
find(
    predicate: (value: T, index: number, obj: T[]) => unknown, 
    thisArg?: any): T | undefined;
```

---

### Функции анализа

```typescript
// Determines whether the specified callback function 
// returns true for any element of an array.
some(
    predicate: (value: number, index: number, array: Int8Array) 
        => unknown, 
    thisArg?: any): boolean;
// Determines whether all the members of an array 
// satisfy the specified test.    
every(
    predicate: (value: number, index: number, array: Int8Array) 
        => unknown, 
    thisArg?: any): boolean;
```

---

<div class='quiz' data-quiz='{ 
    "question": "Какой тип возвращает функция <code>find(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any)</code>?",    
    "right": [ 
        "<code>T | undefined</code>"
    ],
    "wrong": [
        "<code>T[]</code>",
        "<code>T</code>",
        "<code>T[] | undefined</code>"
    ]
}'></div>

---

<div class='quiz' data-quiz='{ 
    "question": "Какая функция проверяет, все ли элементы массива удовлетворяют условию?",    
    "right": [ 
        "<code>every</code>"
    ],
    "wrong": [
        "<code>find</code>",
        "<code>some</code>",
        "<code>any</code>"
    ]
}'></div>

----

### Свертка

```typescript
const all_boys = p(
    boys.reduce(
        (previousValue: string, currentValue: string) => 
            previousValue + ", " + currentValue
    ))
```
```
Sheldon, Leonard, Howard, Raj
```

---

### Свертка

```typescript
const average = p(
    grades.reduce(
        (previousValue: number, currentValue: Grade) => 
            previousValue + currentValue.value,
        0
    ) / grades.length)
```
```
4
```

---

### Свертка

```typescript
const max = p(grades.reduce(
    (previousValue: Grade, currentValue: Grade) => {
        if (previousValue.value < currentValue.value)
            return currentValue
        else
            return previousValue
    },
))
```
```
Grade { student: Student { name: 'Sheldon' }, value: 5 }
```

---

### Функция reduce

```typescript
reduce<U>(
    callbackfn: (
        previousValue: U, 
        currentValue: T, 
        currentIndex: number, 
        array: T[]) => U, 
    initialValue: U): U;
```


---

<div class='quiz' data-quiz='{ 
    "question": "Какой тип возвращает функция <code>reduce< U >(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U)</code>?",    
    "right": [ 
        "<code>U</code>"
    ],
    "wrong": [
        "<code>T[]</code>",
        "<code>T</code>",
        "<code>U[]</code>"
    ]
}'></div>

---

<div class='quiz' data-quiz='{ 
    "question": "Какие функции возвращают массив элементов",    
    "right": [ 
        "<code>map</code>",
        "<code>filter</code>"
    ],
    "wrong": [
        "<code>find</code>",
        "<code>reduce</code>"        
    ]
}'></div>

----

### Сортировка

```typescript
// Sorts an array in place.
// This method mutates the array and 
//  returns a reference to the same array.
sort(compareFn?: (a: T, b: T) => number): this;
```
