### DOM

Document Object Model 

HTML, XML, SVG, ...

---

### Типы данных (интерфейсы)

- Document
- Node
- Element

---

### Типы данных (интерфейсы)

- NodeList
- Attr
- NamedNodeMap

---

### Примеры методов

- ```document.createElement()```
- ```document.querySelector()```
- ```Element.getAttribute()```
- ```Element.setAttribute()```
- ```Node.appendChild()```


---

<div class='quiz' data-quiz='{         
  "question": "Что из перечисленного является типами данных DOM?",
    "right": [
      "<code>Node</code>",
      "<code>Element</code>",
      "<code>NodeList</code>"
    ],
    "wrong": [
      "<code>ElementList</code>"
    ]
}'></div>

---

<div class='quiz' data-quiz='{         
    "question": "Что из перечисленного является методами DOM?",
    "right": [
      "<code>createElement</code>",
      "<code>getAttribute</code>"
    ],
    "wrong": [
      "<code>createAttribute</code>",
      "<code>getElement</code>"
    ]
}'></div>

---

<div class='quiz' data-quiz='{         
    "question": "Что из перечисленного является методами DOM?",
    "right": [
      "<code>querySelector</code>",
      "<code>appendChild</code>"
    ],
    "wrong": [
      "<code>appendAttribute</code>",
      "<code>queryElement</code>"
    ]
}'></div>

----

### Сериализация в XML

```typescript
import { json2xml } from "xml-js"

const math = [new SerialLesson("Математика",
    [new SerialStudent("Александр", "Пушкин"),
    new SerialStudent("Лев", "Толстой"),])]
const options = { 
    compact: true, 
    ignoreComment: true, 
    spaces: 4 }
const math_xml = json2xml(
    JSON.stringify(math), 
    options)
console.log(math_xml)
```

---

### Сериализация в XML

```XML
<0>
    <name>Математика</name>
    <students>
        <firstname>Александр</firstname>
        <surname>Пушкин</surname>
    </students>
    <students>
        <firstname>Лев</firstname>
        <surname>Толстой</surname>
    </students>
</0>
```

---

### Создание XML DOM

```typescript
import { create } from "xmlbuilder2"
const xml = create({ version: "1.0" })
    .ele("lessons", { att: "array" })
    .ele("SerialLesson")
    .ele("name").txt("Математика").up()
    .ele("students")
    .ele("SerialStudent")
    .ele("firstname").txt("Александр").up()
    .ele("surname").txt("Пушкин").up()
    .up().ele("SerialStudent")
    .ele("firstname").txt("Лев").up()
    .ele("surname").txt("Толстой").up()
    .up().up()
    .end({ prettyPrint: true })
```

---

### Создание XML DOM

```XML
<?xml version="1.0"?>
<lessons att="array">
  <SerialLesson>
    <name>Математика</name>
    <students>
      <SerialStudent>
        <firstname>Александр</firstname>
        <surname>Пушкин</surname>
      </SerialStudent>
      <SerialStudent>
        <firstname>Лев</firstname>
        <surname>Толстой</surname>
      </SerialStudent>
    </students>
  </SerialLesson>
</lessons>
```

---

<div class='quiz' data-quiz='{         
    "question": "Какая библиотека преобразует JSON в XML?",
    "right": [
      "<code>xml-js</code>"
    ],
    "wrong": [
      "<code>xmlbuilder2</code>",
      "<code>xmldom</code>",
      "<code>class-transform</code>"
    ]
}'></div>

----

### DOM Parser

```typescript
import { DOMParser } from "@xmldom/xmldom"
const dom = new DOMParser().parseFromString(xml, "text/xml")
const nodes = Array.from(dom?.childNodes)
    .map(node => `${node.nodeName}: ${node.textContent}\n`)
console.log("Nodes: ", nodes)
```
```
Nodes:  [
  'xml: version="1.0"\n',
  '#text: \n\n',
  'lessons: \n' +
    '  \n' +
    '    Математика\n' +
    '    \n' +
    '      \n' +
    '        Александр\n' +
    '        Пушкин\n' +
    '      \n' +
    '      \n' +
    '        Лев\n' +
    '        Толстой\n' +
    '      \n' +
    '    \n' +
    '  \n' +
    '\n'
]
```

---

### Анализ DOM

```typescript
const math_node = dom.lastChild?.childNodes.item(1)
console.log("Math: ", math_node?.textContent)
```
```
Math:
    Математика


        Александр
        Пушкин


        Лев
        Толстой



```

---

### Редактирование DOM

```typescript
const math_name = math_node?.childNodes.item(1)
if(math_name?.textContent) 
    math_name.textContent = "Физика"
const new_nodes = Array.from(dom?.childNodes)
    .map(node => `${node.nodeName}: ${node.textContent}\n`)
console.log("New nodes: ", new_nodes)
```
```
New nodes:  [
  'xml: version="1.0"\n',
  '#text: \n\n',
  'lessons: \n' +
    '  \n' +
    '    Физика\n' +
    '    \n' +
    '      \n' +
    '        Александр\n' +
    '        Пушкин\n' +
    '      \n' +
    '      \n' +
    '        Лев\n' +
    '        Толстой\n' +
    '      \n' +
    '    \n' +
    '  \n' +
    '\n'
]
```

---

<div class='quiz' data-quiz='{         
    "question": "Какая библиотека может использоваться для создания XML DOM?",
    "right": [
      "<code>xmlbuilder2</code>",
      "<code>xmldom</code>"
    ],
    "wrong": [
      "<code>xml-js</code>",
      "<code>class-transform</code>"
    ]
}'></div>

---

<div class='quiz' data-quiz='{         
    "question": "Какая библиотека подходит для редактирования XML DOM?",
    "right": [
      "<code>xmldom</code>"
    ],
    "wrong": [
      "<code>xmlbuilder2</code>",
      "<code>xml-js</code>",
      "<code>class-transform</code>"
    ]
}'></div>