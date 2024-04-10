### Исходные данные

[https://www.fedstat.ru/](https://www.fedstat.ru/)

[Пример](data.xml)

```XML
<GenericData xmlns="http://www.SDMX.org/..."
<Header
<CodeList
<Description
<DataSet
```


---

### Коды

```XML
<CodeLists>
	<structure:CodeList id="s_OKVED2">
    ...
    	<structure:Code value="62">
			<structure:Description xml:lang="ru">
                Разработка компьютерного программного обеспечения
    <structure:CodeList id="s_OKATO">
```

---

### Статистика

```XML
	<generic:Series>
		<generic:SeriesKey>
			<generic:Value concept="s_OKVED2" value="62"/>
			<generic:Value concept="s_OKATO" value="643"/>
		</generic:SeriesKey>
		<generic:Attributes>
			<generic:Value concept="EI" value="рубль"/>
			<generic:Value concept="PERIOD" value="январь"/>
		</generic:Attributes>
		<generic:Obs>
			<generic:Time>2022</generic:Time>
			<generic:ObsValue value="134443,7"/>
		</generic:Obs>
	</generic:Series>
```

---

<div class='quiz' data-quiz='{         
    "question": "Как называется международный стандарт обмена данными?",
    "right": [
      "SDMX"
    ],
    "wrong": [
      "SXML",
      "SDOM",
      "XPath"
    ]
}'></div>

----

### Загрузка файла

```typescript
import * as fs from "node:fs"
import { DOMParser as dom } from '@xmldom/xmldom'

const xml = fs.readFileSync("data.xml", { encoding: "utf-8" })
const start_dom = new Date().getTime()
const doc = new dom().parseFromString(xml, "text/xml")
const elapsed_dom = new Date().getTime() - start_dom
console.log("Elapsed DOM: " + elapsed_dom + "ms" + "\n")
```
```
Elapsed DOM: 136ms
```

---

### Пространства имен

```typescript
const nsResolver: XPathNSResolver = {
    lookupNamespaceURI(prefix) {
        switch (prefix) {
            case "generic": return "http://www.SDMX.org/resources/SDMXML/schemas/v1_0/generic"
            case "structure": return "http://www.SDMX.org/resources/SDMXML/schemas/v1_0/structure"
            default: return "http://www.SDMX.org/resources/SDMXML/schemas/v1_0/message"
        }
    }
}
```

---

### Получение узлов

```typescript
const series = selectWithResolver(
    "//generic:Series", 
    doc, 
    nsResolver) as Node[]
console.log("Данных: " + series.length) 
```
```
Данных: 1050
```

---

<div class='quiz' data-quiz='{         
    "question": "Какие аргументы есть у функции <code>selectWithResolver</code>?",
    "right": [
      "XPATH запрос",
      "XML документ",
      "NS резолвер"
    ],
    "wrong": [
      "DOM билдер"
    ]
}'></div>


---

<div class='quiz' data-quiz='{         
    "question": "Как разделяются пространство и имя элемента в XPath?",
    "right": [
      ":"
    ],
    "wrong": [
      ".",
      "/",
      "//"
    ]
}'></div>

----

### Пространство по умолчанию

```typescript
const header = selectWithResolver(
    "//_:Header", 
    doc, 
    nsResolver) as Node[]
console.log("Заголовок: " + header[0].nodeName)
```
```
Заголовок: Header
```

---

### Путь

```typescript
const codes = selectWithResolver(
    "//structure:CodeList/structure:Name", 
    doc, 
    nsResolver) as Node[]
console.log("Коды: " + codes.map(node => node.textContent))
```
```
Коды: 
Классификатор видов экономической деятельности (ОКВЭД2),
Классификатор объектов административно-территориального деления (ОКАТО)
```

---

### Уточнение атрибутов

```typescript
const okato = selectWithResolver(
    "//structure:CodeList[@id = 's_OKATO']/structure:Code", 
    doc, 
    nsResolver) as Node[]
console.log("ОКАТО: " + okato.length)
```
```
ОКАТО: 98
```

---

<div class='quiz' data-quiz='{         
    "question": "Как в пути разделяются имя узла и имя непосредственно вложенного узла XPath?",
    "right": [
      "/"
    ],
    "wrong": [
      ".",
      ":",
      "//"
    ]
}'></div>

---

<div class='quiz' data-quiz='{         
    "question": "Как в пути разделяются имя узла и имя вложенного на любом уровне узла XPath?",
    "right": [
      "//"
    ],
    "wrong": [
      ".",
      ":",
      "/"
    ]
}'></div>

---

<div class='quiz' data-quiz='{         
    "question": "Как правильно уточнить значение аттрибута узла в XPath?",
    "right": [
      "[@id = \"s_OKATO\"]"
    ],
    "wrong": [
      "[\"id\" = \"s_OKATO\"]",
      "{\"id\" = \"s_OKATO\"}",
      "(\"id\" = \"s_OKATO\")"
    ]
}'></div>

----

### Сложные критерии

```typescript
const okato_codes = selectWithResolver(
    `//structure:CodeList[@id = 's_OKATO']/structure:Code/
    structure:Description[contains(., 'мск')]`, 
    doc, nsResolver) as Node[]
console.log("Коды ОКАТО: " + okato_codes.map(node => {
    const code_element = node.parentNode as Element
    return node.textContent + " "
        + code_element.attributes[0].value
})) 
```
```
Коды ОКАТО: Костромская область 34000000000,
Пермский край 57000000000,Омская область 52000000000,
Томская область 69000000000
```

---

### XPath в обработке узла

```typescript
console.log("Коды ОКАТО: " + okato_codes.map(node => {
    const value = (select("../@value", node) 
        as Attr[])[0].value
    return node.textContent + " " + value
}))
```

---

### Обрабатываем статистику

```typescript
function getData(cursor: Node[]) {
    return cursor.map(node => {
        const year = (selectWithResolver(
            "../..//generic:Time", 
            node, nsResolver) as Node[])[0].textContent
        const month = (selectWithResolver(
            "../..//generic:Value[@concept = 'PERIOD']/@value", 
            node, nsResolver) as Attr[])[0].value
        const value = (selectWithResolver(
            "../..//generic:ObsValue/@value", 
            node, nsResolver) as Attr[])[0].value
        return "" + month + " " + year + ": " + value + "\n"
    })  .sort() .slice(0, 10) 
    .reduce((p: string, c: string) => p + c)
```

---

<div class='quiz' data-quiz='{
    "question": "Как в XPath указывается, что условие задается для текущего узла?",
    "right": [
      "."
    ],
    "wrong": [
      "..",
      ":",
      "_"
    ]
  }'></div>

---

<div class='quiz' data-quiz='{
    "question": "Как в XPath указывается, что условие задается для родительского узла?",
    "right": [
      ".."
    ],
    "wrong": [
      ".",
      ":",
      "_"
    ]
  }'></div>

----

### Статистика по России

```typescript
const query1 = "//generic:SeriesKey/generic:Value[@value = '643']"
const z1 = selectWithResolver(query1, doc, nsResolver) as Node[]
console.log("Средние зарплаты 1:\n" + getData(z1))
```
```
январь 2022: 134443,7
февраль 2022: 139431,4
январь-февраль 2022: 138183,6
```

---

### Дополнительные условия

```typescript
const query2 = query1 + `[../../generic:Attributes/generic:Value
[@concept='PERIOD' and not(contains(@value, '-'))]]`
const z2 = selectWithResolver(query2, doc, nsResolver) as Node[]
console.log("Средние зарплаты 2:\n" + getData(z2))
```
```
август 2022: 100808,6
август 2022: 129956,3
август 2022: 37677,8
```

---

### Дополнительные условия

```typescript
const query3 = query2 + 
"[../generic:Value[@concept='s_OKVED2' and @value='62']]"
const start_time = new Date().getTime()
const z3 = selectWithResolver(query3, doc, nsResolver) as Node[]
const elapsed = new Date().getTime() - start_time
console.log("Elapsed: " + elapsed + "ms")
console.log("Средние зарплаты 3:\n" + getData(z3))
```
```
Elapsed: 30ms
Средние зарплаты 3:
январь 2022: 134443,7
февраль 2022: 139431,4
март 2022: 189156,9
апрель 2022: 145504,7
май 2022: 140247,7
```

---

<div class='quiz' data-quiz='{
    "question": "Как в XPath можно объединить два условия с помощью логического <code>и</code>?",
    "right": [
      "<code>and</code>",
      "<code>[][]</code>"
    ],
    "wrong": [
      "|",
      "&"
    ]
  }'></div>

---

<div class='quiz' data-quiz='{
    "question": "Как в XPath можно объединить два условия с помощью логического <code>или</code>?",
    "right": [
      "|"
    ],
    "wrong": [
      "<code>and</code>",
      "<code>[][]</code>",
      "&"
    ]
  }'></div>