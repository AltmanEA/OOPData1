### SAX

Simple API for XML –

основанный на событиях парсер для XML

---

### Конечные автоматы

<div style="display: flex;">
    <div style="flex: 2;">
<pre><code>@startuml
[*] --> Lists: CodeLists
Lists --> Codes: CodeList
Lists --> [*]: /CodeLists
Codes --> ReadText: Name
Codes --> Lists: /CodeList
ReadText -> ReadText: onText
ReadText -> Codes: /Name
@enduml</code></pre>
    </div>
    <div style="flex: 2;">
	    <img src="fs1.svg"/>
    <div>
<div>

---

### Библиотеки

```typescript
import * as fs from "node:fs"
import pkg, { QualifiedTag, Tag } from "sax"
const { SAXParser } = pkg

const xml = fs.readFileSync("data.xml", { encoding: "utf-8" })
const parser = new SAXParser()
```

---

### Состояние

```typescript
class State {
    constructor(public name: string) { }
    onopentag: (tag: Tag | QualifiedTag) => void = () => { }
    onclosetag: (tagName: string) => void = () => { }
    ontext: (t: string)  => void = () => { }
}

var current: State
var result = ""
```

---

### Запуск парсера

```typescript
current = start
parser.onopentag = function (tag: Tag | QualifiedTag): void {
    current.onopentag(tag)
}
parser.onclosetag = function (tagName: string): void {
    current.onclosetag(tagName)
}
parser.ontext = function (t: string): void {
    current.ontext(t)
}
parser.write(xml).close()
console.log(result)
```

---

<div class='quiz' data-quiz='{
    "question": "В чем преимущество потокового парсера SAX?",
    "right": [
      "Скорость работы",
      "Возможность анализа XML без преобразования в DOM"
    ],
    "wrong": [
      "Простота программирования",
      "Гибкая система команд"
    ]
  }'></div>

----

### Описываем состояния

<div style="display: flex;">
    <div style="flex: 2;">
<pre><code>const start = new State("start")
const lists = new State("lists")
const codes = new State("codes")
const readText = 
    new State("readText")</code></pre>
    </div>
    <div style="flex: 2;">
	    <img src="fs1.svg"/>
    <div>
<div>

---

### Открытие тега

<div style="display: flex;">
    <div style="flex: 2;">
<pre><code>start.onopentag = 
    function (tag): void {
if (tag.name == "CODELISTS") 
        current = lists }
lists.onopentag = 
    function (tag): void {
if (tag.name == "STRUCTURE:CODELIST") 
        current = codes }
codes.onopentag = 
    function (tag): void {
if (tag.name == "STRUCTURE:NAME") 
        current = readText }</code></pre>
    </div>
    <div style="flex: 2;">
	    <img src="fs1.svg"/>
    <div>
<div>

---

### Закрытие тега

<div style="display: flex;">
    <div style="flex: 2;">
<pre><code>lists.onclosetag = 
function (tagName: string): void {
if (tagName == "CODELISTS") 
    current = start}
codes.onclosetag = 
function (tagName: string): void {
if (tagName == "STRUCTURE:CODELIST") 
    current = lists }
readText.onclosetag = 
function (tagName: string): void {
if (tagName == "STRUCTURE:NAME") 
        current = codes}</code></pre>
    </div>
    <div style="flex: 2;">
	    <img src="fs1.svg"/>
    <div>
<div>

---

### Чтение текста

<div style="display: flex;">
    <div style="flex: 2;">
<pre><code>readText.ontext = 
function (t: string): void {
    result += t + "\n"
}</code></pre><small>
Классификатор видов экономической деятельности (ОКВЭД2)<br>
Классификатор объектов административно-территориального деления (ОКАТО)
</small></div>
    <div style="flex: 2;">
	    <img src="fs1.svg"/>
    <div>
<div>


---

<div class='quiz' data-quiz='{
    "question": "Какие события происходят в SAX?",
    "right": [
      "<code>onopentag</code>",
      "<code>ontext</code>"
    ],
    "wrong": [
      "<code>startElement</code>",
      "<code>endNode</code>"
    ]
  }'></div>

----

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

### Алгоритм обработки

![](fs2.svg)

---

### Сохранение и проверка данных

```typescript
class Series {
    okved = ""
    okato = ""
    period = ""
    time = ""
    value = "" }
const series_list: Array<Series> = []
var current_series = new Series()
function check_series(series: Series): boolean {
    if (series.okved !== "62") return false
    if (series.okato !== "643") return false
    if (series.period.indexOf("-") > 0) return false
    return true }
```

---

### Заполнение данных

```typescript
seriesKey.onopentag = function (tag): void {
    if (tag.name == "GENERIC:VALUE") {
        const attr = tag.attributes as {
            "CONCEPT": string,
            "VALUE": string
        }
        if (attr.CONCEPT === "s_OKVED2")
            current_series.okved = attr.VALUE
        if (attr.CONCEPT === "s_OKATO")
            current_series.okato = attr.VALUE
    }
}
```

---

### Результат

```typescript
Elapsed: 105ms
январь 2022 134443,7 
февраль 2022 139431,4
март 2022 189156,9   
апрель 2022 145504,7 
май 2022 140247,7    
июнь 2022 141146,2
июль 2022 134128,3
август 2022 129956,3
сентябрь 2022 133703,2
октябрь 2022 134534,6
ноябрь 2022 141369,9
декабрь 2022 192310,7
январь 2023 143303,5
февраль 2023 156989,3
март 2023 165672
апрель 2023 161223,8
май 2023 160819,3
июнь 2023 158821,9
июль 2023 156042
август 2023 153805,2
сентябрь 2023 152878,2
октябрь 2023 162370,6
```

---

<div class='quiz' data-quiz='{
    "question": "Какие связи между элементами конечного автомата и потокового парсера?",
    "right": [
      "переходы - события парсера",
      "состояния - чтение определенного узла XML"
    ],
    "wrong": [
      "переходы - переход на другой узел XML",
      "состояния - события парсера"
    ]
  }'></div>
