import * as fs from "node:fs"
import { DOMParser as dom } from '@xmldom/xmldom'
import { Collection, MongoClient } from "mongodb"

const xml = fs.readFileSync("data_m.xml", { encoding: "utf-8" })

const start_dom = new Date().getTime()
const doc = new dom().parseFromString(xml, "text/xml")

const part = doc.documentElement.childNodes

let codeLists = {} as NodeList
let dataset = {} as NodeList

for (let i = 0; i < part.length; i++) {
    const v = part[i]
    if (v.nodeName === "CodeLists")
        codeLists = v.childNodes
    if (v.nodeName === "DataSet")
        dataset = v.childNodes
}

let okato = {} as NodeList
let grtov = {} as NodeList

function isElement(node: Node): node is Element {
    return node.nodeType === 1;
}

for (let i = 0; i < codeLists.length; i++) {
    const v = codeLists[i]
    if (isElement(v)) {
        if (v.attributes[0].value == "s_OKATO")
            okato = v.childNodes
        if (v.attributes[0].value == "s_grtov")
            grtov = v.childNodes
    }
}

class Code {
    constructor(
        public name: string,
        public code: number
    ) { }
}

const goods = getCodes(grtov)
const okatoCodes = getCodes(okato)

function getCodes(node: NodeList) {
    const result = []
    for (let i = 0; i < node.length; i++) {
        const v = node[i]
        if (isElement(v)) {
            if (v.nodeName === "structure:Code")
                result.push(new Code(
                    v.textContent?.trim() ?? "",
                    parseInt(v.attributes[0].value)))
        }
    }
    return result
}

// console.log(goods.slice(0, 5))
// console.log(okatoCodes.slice(0, 5))

class Series{
    constructor(
        public okato: number = -1,
        public grtov: number = -1,
        public ei: string = "",
        public period: string = "",
        public time: string = "",
        public obs: string = ""
    ) { }
}

function getSeries(node: NodeList) {
    const result = new Series()
    for (let i = 0; i < node.length; i++) {
        const v = node[i]
        if (isElement(v)) {
            const leafs = v.childNodes
            for (let i = 0; i < leafs.length; i++) {
                const leaf = leafs[i]
                if (isElement(leaf)) {
                    if (leaf.nodeName === "generic:Time")
                        result.time = leaf.textContent ?? ""
                    if (leaf.nodeName === "generic:ObsValue")
                        result.obs = leaf.attributes[0].value
                    if (leaf.nodeName === "generic:Value"){
                        if (leaf.attributes[0].value === "s_OKATO")
                            result.okato = parseInt(leaf.attributes[1].value)
                        if (leaf.attributes[0].value === "s_grtov")
                            result.grtov = parseInt(leaf.attributes[1].value)
                        if (leaf.attributes[0].value === "EI")
                            result.ei = leaf.attributes[1].value
                        if (leaf.attributes[0].value === "PERIOD")
                            result.period = leaf.attributes[1].value
                    }
                }

            }
        }
    }
    return result
}

const series: Series[] = []

for (let i = 0; i < dataset.length; i++) {
    const v = dataset[i]    
    if (isElement(v)) {
        series.push(getSeries(v.childNodes))
    }
}

// console.log(series.slice(0, 5))

const CONNECTION = "mongodb://root:example@127.0.0.1:27017/"
const DB_NAME = "stat"


const client = new MongoClient(CONNECTION, { monitorCommands: true })

async function run() {
    try {
        await client.connect()
        // database and collection code goes here
        console.log("CONNECT")
        const db = client.db(DB_NAME)
        const goods_col = db.collection("goods") as Collection<Code>
        const okato_col = db.collection("okato") as Collection<Code>
        const series_col = db.collection("series") as Collection<Series>
        goods_col.drop()
        okato_col.drop()
        okato_col.drop()

        await goods_col.insertMany(goods)
        await okato_col.insertMany(okatoCodes)
        await series_col.insertMany(series)

    } finally {
        // Ensures that the client will close when you finish/error
        console.log("MONGO CLOSING")
        await client.close()
    }
}

console.log("RUN MONGO")
run().catch(console.dir)