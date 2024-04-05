### Проблемы хранения объектов

- Соответствие типов
- Ссылки и вложенные объекты
- Согласованность данных

---

### Решение проблем

#### Виды решений

- Object Document Mapper
- Object–relational mapping

#### Шаблоны

- Active Record
- Data Access Object
- Repository

---

### Библиотеки

- [Mongoose](https://github.com/Automattic/mongoose)
- [Typegoose](https://github.com/typegoose/typegoose)
- [TypeORM](https://github.com/typeorm/typeorm)

----

#### Mongoose

```javascript
// javascript 

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
  // await mongoose.connect(
  //   'mongodb://user:password@127.0.0.1:27017/test');  
}
```

---

#### Схема и модель Mongoose

```javascript
const kittySchema = new mongoose.Schema({
  name: String
});
```

```javascript
const Kitten = mongoose.model('Kitten', kittySchema);
```

---

### Методы объектов

```javascript
kittySchema.methods.speak = function speak() {
  const greeting = this.name
    ? 'Meow name is ' + this.name
    : 'I don\'t have a name';
  console.log(greeting);
};

const Kitten = mongoose.model('Kitten', kittySchema);
```

---

### Сохранение объектов

```javascript
const fluffy = new Kitten({ name: 'fluffy' })
fluffy.speak(); // "Meow name is fluffy"
await fluffy.save()
fluffy.speak(); // "Meow name is fluffy"
fluffy.overwrite({ name: 'kitty' });
await fluffy.save()
```

---

### Поиск и другие методы

```javascript
await Kitten.find({ name: 'fluff' });
await Kitten.deleteOne({ name: 'fluff' });
```

----

### Typescript и mongoose

```typescript
// 1. Create an interface representing a document in MongoDB.
interface IUser {
  name: string;
  email: string;
  // Use `Types.ObjectId` in document interface...
  organization: Types.ObjectId;
}
// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  // And `Schema.Types.ObjectId` in the schema definition.
  organization: { type: Schema.Types.ObjectId, ref: 'Organization' }
});
```

---

### Typegoose

```typescript
class KittenClass {
  @prop()
  public name?: string

  meow(): string {
    const greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name"
    console.log(greeting)
    return greeting } }

const KittenModel = getModelForClass(KittenClass)
```

---

### Typegoose

```typescript
async function run(): Promise<void> {
  await mongoose.connect('mongodb://root:example@127.0.0.1:27017/')
  console.log("CONNECT")
  let kitty = await KittenModel.create({ name: 'Kitty' })
  console.log(kitty)
  kitty.meow() }
run().catch(console.dir)
```
```
{
  name: 'Kitty',
  _id: new ObjectId('660f8d1f68a379ac416fb304'),
  __v: 0
}
Meow name is Kitty
```
