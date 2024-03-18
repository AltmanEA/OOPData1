### База данных

```typescript
class Code { constructor(
    public name: string,
    public code: number
    ) { } }
class Series { constructor(
    public okato: number = -1,
    public grtov: number = -1,
    public ei: string = "",
    public period: string = "",
    public time: string = "",
    public obs: string = ""
    ) { } }
```

---

### База данных

```typescript
const goods_col = db.collection("goods") as Collection<Code>
const okato_col = db.collection("okato") as Collection<Code>
const series_col = db.collection("series") as Collection<Series>
```

[Преобразование xml в mongo](xml2mongo.ts)

----

### Разъяснение запроса

```typescript
const series = await series_col.find({
    okato: 643,
    grtov: 9419
}).explain()
console.log(series)
```

---

### Планирование запроса

```typescript
queryPlanner: {
    namespace: 'stat.series',
    indexFilterSet: false,
    parsedQuery: { '$and': [Array] },
    queryHash: '52113392',
    planCacheKey: '52113392',
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    winningPlan: { stage: 'COLLSCAN', 
        filter: [Object], 
        direction: 'forward' },
    rejectedPlans: []
}
```

---

### Статистика запроса

<div style="display: flex;">
    <div style="flex: 2;">
<pre><code>executionStats: {
    executionSuccess: true,
    nReturned: 12,
    executionTimeMillis: 9,
    totalKeysExamined: 0,
    totalDocsExamined: 26712,
    executionStages: {
        ...
    },
    allPlansExecution: []
}</code></pre>
</div>
<div style="flex: 2;">
<pre><code>stage: 'COLLSCAN',
filter: [Object],
nReturned: 12,
executionTimeMillisEstimate: 0,
works: 26713,
advanced: 12,
needTime: 26700,
needYield: 0,
saveState: 26,
restoreState: 26,
isEOF: 1,
direction: 'forward',
docsExamined: 26712</code></pre>
</div></div>

----

### Создание индекса

```typescript
series_col.createIndex({
    okato: 1
})
```

![](index_okato.png)

---

### Планирование запроса

```typescript
queryPlanner: {
    namespace: 'stat.series',
    indexFilterSet: false,
    parsedQuery: { '$and': [Array] },
    queryHash: '52113392',
    planCacheKey: 'D9C83BEF',
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    winningPlan: { 
        stage: 'FETCH', 
        filter: [Object], 
        inputStage: [Object] },
    rejectedPlans: [] }
```

---

### Статистика запроса

<div style="display: flex;">
    <div style="flex: 2;">
<pre><code>executionStats: {
    executionSuccess: true,
    nReturned: 12,
    executionTimeMillis: 7,
    totalKeysExamined: 6744,
    totalDocsExamined: 6744,
    executionStages: {
        ...
    },
    allPlansExecution: []
  }</code></pre>
</div>
<div style="flex: 2;">
<pre><code>stage: 'FETCH',
filter: [Object],
nReturned: 12,
executionTimeMillisEstimate: 1,
works: 6745,
advanced: 12,
needTime: 6732,
needYield: 0,
saveState: 6,
restoreState: 6,
isEOF: 1,
docsExamined: 6744,
alreadyHasObj: 0,
inputStage: [Object]</code></pre>
</div></div>

---

### Индекс по группе товаров

<div style="display: flex;">
    <div style="flex: 2;">
<pre><code>  executionStats: {
    executionSuccess: true,
    nReturned: 12,
    executionTimeMillis: 0,
    totalKeysExamined: 48,
    totalDocsExamined: 48,
    executionStages: {
        ...
    },
    allPlansExecution: []
  }</code></pre>
</div>
<div style="flex: 2;">
<pre><code>stage: 'FETCH',
filter: [Object],
nReturned: 12,
executionTimeMillisEstimate: 0,
works: 49,
advanced: 12,
needTime: 36,
needYield: 0,
saveState: 0,
restoreState: 0,
isEOF: 1,
docsExamined: 48,
alreadyHasObj: 0,
inputStage: [Object]</code></pre>
</div></div>

---

### Индекс по двум полям

```
{   okato: 1,
    grtov: 1    }
```

<div style="display: flex;">
    <div style="flex: 2;">
<pre><code>executionStats: {
    executionSuccess: true,
    nReturned: 12,
    executionTimeMillis: 0,
    totalKeysExamined: 12,
    totalDocsExamined: 12,
    executionStages: {
        ...
    },
    allPlansExecution: []
  }</code></pre>
</div>
<div style="flex: 2;">
<pre><code>stage: 'FETCH',
nReturned: 12,
executionTimeMillisEstimate: 0,
works: 13,
advanced: 12,
needTime: 0,
needYield: 0,
saveState: 0,
restoreState: 0,
isEOF: 1,
docsExamined: 12,
alreadyHasObj: 0,
inputStage: [Object]</code></pre>
</div></div>

----