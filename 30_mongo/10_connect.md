### Установка 

```docker-compose.yml```
```YAML
version: '3.1'

services:

  mongo:
    image: mongo
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
```      

---

### Установка 

```docker-compose.yml```
```YAML
  mongo-express:
    image: mongo-express
    restart: always
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: example
      ME_CONFIG_MONGODB_URL: mongodb://root:example@mongo:27017/
```      

---

### Запуск

```docker-compose up```

![alt text](mongo_container.png)


---

<div class='quiz' data-quiz='{
    "question": "Какой порт по умолчанию используется MongoDB?",
    "right": [
      27017
    ],
    "wrong": [
      8080,
      8081,
      3014
    ]
  }'></div>

---

<div class='quiz' data-quiz='{
    "question": "Как называется web приложение для управления MongoDB?",
    "right": [
      "mongo-express"
    ],
    "wrong": [
      "mongo-admin",
      "mongo-console",
      "mongoMyAdmin"
    ]
  }'></div>

----

### Mongo express

![alt text](mongo_express_database.png)

---

### Коллекции

![alt text](mongo_express_collections.png)

---

### Коллекция

![alt text](mongo_express_in_collection.png)

---

### Документ

![alt text](mongo_express_document.png)


---

<div class='quiz' data-quiz='{
    "question": "Как поле обязательно есть в документе MongoDB?",
    "right": [
      "<code>_id</code>"
    ],
    "wrong": [
      "<code>name</code>",
      "<code>collection</code>",
      "<code>ObjectId</code>"
    ]
  }'></div>

---

<div class='quiz' data-quiz='{
    "question": "Что из перечисленного верно?",
    "right": [
      "документы хранятся в коллекции MongoDB",
      "база данных MongoDB состоит из коллекций"
    ],
    "wrong": [
      "коллекция MongoDB содержит объекты",
      "в MongoDB содержит таблицы"
    ]
  }'></div>

----

### Настройка подключения к БД

```typescript
import { Collection, MongoClient } from "mongodb"

const CONNECTION = "mongodb://root:example@127.0.0.1:27017/"

const client = new MongoClient(
    CONNECTION, 
    { monitorCommands: true }
)
// client.on('commandStarted', (event) => console.debug(event))
// client.on('commandSucceeded', (event) => console.debug(event))
// client.on('commandFailed', (event) => console.debug(event))
```

---

### Подключение к БД

```typescript
async function run() {
    try {
        await client.connect()
        console.log("CONNECT")
        const db = client.db(DB_NAME)
        const scholars = db.collection(COLLECTION) 
            as Collection<Scholar>
        scholars.drop()
    } finally {        
        console.log("MONGO CLOSING")
        await client.close();
    }}
console.log("RUN MONGO")
run().catch(console.dir)
```

---

<div class='quiz' data-quiz='{
    "question": "Какие операции с MongoDB возвращают promise?",
    "right": [
      "<code>client.connect()</code>",
      "<code>scholars.drop()</code>"
    ],
    "wrong": [
      "<code>client.db(DB_NAME)</code>",
      "<code>db.collection(COLLECTION)</code>"
    ]
  }'></div>

---

<div class='quiz' data-quiz='{
    "question": "Какие аргументы у конструктора <code>MongoClient</code>?",
    "right": [
      "строка подключения",
      "объект конфигурации"
    ],
    "wrong": [
      "адрес сервера",
      "имя базы данных"
    ]
  }'></div>