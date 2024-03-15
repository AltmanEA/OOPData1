### CRUD

- Create
- Read
- Update
- Delete

---

### Create

```typescript
class Scholar {
    constructor(
        public name: string,
        public group: number
    ) { } }
const new_scholar = ["Маша 22", "Даша 22",
    "Саша 23", "Вася 23", "Петя 24", "Коля 24" 
].map(x => { const s = x.split(" ")
    return new Scholar(s[0], parseInt(s[1]))
})

console.log("\t\tCREATE")
await scholars.insertOne(new_scholar[0])
await scholars.insertMany(new_scholar.slice(1, 3))
```

---

### Запрос

```JSON
CommandStartedEvent { name: 'commandStarted',
  address: '127.0.0.1:27017',
  connectionId: 2,
  serviceId: undefined,
  requestId: 8,
  databaseName: 'test',
  commandName: 'insert',
  command: {
    insert: 'scholar',
    documents: [ [Scholar] ],
    ordered: true,
    lsid: { id: Binary.createFromBase64('imxaE1pKQ0e67PNp9+Z07A==', 4) },
    '$db': 'test' }}
```

---

### Ответ

```JSON
CommandSucceededEvent {
  name: 'commandSucceeded',
  address: '127.0.0.1:27017',
  connectionId: 2,
  serviceId: undefined,
  requestId: 8,
  commandName: 'insert',
  duration: 19,
  reply: { n: 1, ok: 1 }
}
```

----

### Read

```typescript
await scholars.find().toArray()
```
```JSON
[ {
    _id: new ObjectId('65f3d3ab343cf0fa0cb92c78'),
    name: 'Маша',
    group: 22
  }, {
    _id: new ObjectId('65f3d3ab343cf0fa0cb92c79'),
    name: 'Даша',
    group: 22
  }, {
    _id: new ObjectId('65f3d3ab343cf0fa0cb92c7a'),
    name: 'Саша',
    group: 23
  } ]
```

---

### Read

```typescript
scholars.findOne({ name: 'Маша' })
scholars.find({ group: 22 }).toArray()
```
```JSON
{
  _id: new ObjectId('65f3d3ab343cf0fa0cb92c78'),
  name: 'Маша',
  group: 22 
}
[ {
    _id: new ObjectId('65f3d3ab343cf0fa0cb92c78'),
    name: 'Маша',
    group: 22
  }, {
    _id: new ObjectId('65f3d3ab343cf0fa0cb92c79'),
    name: 'Даша',
    group: 22
  } ]
```

---

### Read


```typescript
scholars.find({ group: 22, name: 'Даша'}).toArray()
scholars.find({ group: { $gt: 22 } }).toArray()
scholars.find({ group: { $gt: 22, $lt: 25 } }).toArray()
```
[Comparison Query Operators](https://www.mongodb.com/docs/manual/reference/operator/query-comparison/)
```JSON
[ {
    _id: new ObjectId('65f3d3ab343cf0fa0cb92c79'),
    name: 'Даша',
    group: 22 } ]
[ {
    _id: new ObjectId('65f3d3ab343cf0fa0cb92c7a'),
    name: 'Саша',
    group: 23 } ]
[ {
    _id: new ObjectId('65f3d3ab343cf0fa0cb92c7a'),
    name: 'Саша',
    group: 23  } ]
```

----

### Update

```typescript
scholars.updateOne(
    { name: 'Маша' },
    { $set: { name: "Мария" } }
)
```
```JSON
{
  _id: new ObjectId('65f3d3ab343cf0fa0cb92c78'),
  name: 'Мария',
  group: 22
}
```

---

### Update

```typescript
scholars.updateMany(
    { group: 22 },
    { $set: { group: 21 } }
)  
```
```JSON
[ {
    _id: new ObjectId('65f3d3ab343cf0fa0cb92c78'),
    name: 'Мария',
    group: 21 }, {
    _id: new ObjectId('65f3d3ab343cf0fa0cb92c79'),
    name: 'Даша',
    group: 21 }, {
    _id: new ObjectId('65f3d3ab343cf0fa0cb92c7a'),
    name: 'Саша',
    group: 23 } ]
```

---

### Delete

```typescript
scholars.deleteOne({name: "Саша"})
scholars.deleteMany({group: 21})
```
```JSON
[
  {
    _id: new ObjectId('65f3d704b37607c14ea9eb09'),
    name: 'Мария',
    group: 21
  },
  {
    _id: new ObjectId('65f3d704b37607c14ea9eb0a'),
    name: 'Даша',
    group: 21
  }
]

[]
```

----

### Оператор ```$inc```

The [$inc](https://www.mongodb.com/docs/manual/reference/operator/update/inc/)
 operator increments a field by a specified value.

 [Field Update Operators](https://www.mongodb.com/docs/manual/reference/operator/update-field/)

---

 ### Опция ```upsert``` функции ```update```

When true, [updateOne()](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/) either:
- Creates a new document if no documents match the filter. For more details see upsert behavior.
- Updates a single document that matches the filter.