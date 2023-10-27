// Dependencies ////////////////////////////////////////////
import 'dotenv/config'
import express from 'express'
import pkg from 'pg'
const { Pool } = pkg

const port = process.env.PORT || 5163
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

export const query = async function (sql, params) {
    let client
    let results = []
    try {
        client = await pool.connect()
        const response = await client.query(sql, params)
        if (response && response.rows) {
            results = response.rows
        }
    } catch (err) {
        console.error(err)
    }
    if (client) client.release()
    return results
}

export const getTableOfContents = async function () {
    const data = await query('SELECT chapter_id, title, number FROM section;')
    const table = {}
    data.forEach((row) => {
        if (row.number === 0) {
            table[row.chapter_id] = {}
        }
        table[row.chapter_id][row.number] = row.title
    })

    return table
}

export const getChapter = async function (number) {
    const sql = `SELECT section.title, section.number AS sect_num, element.section_id, element.content, element.index, element.element_type_id AS type
  FROM section RIGHT JOIN element ON section.id = element.section_id
  WHERE section.chapter_id = ${number}
  ORDER BY section_id ASC, index ASC;`
    return await query(sql)
}

express()
    .use(express.static('./public/'))
    .set('views', 'views')
    .set('view engine', 'ejs')
    .get('/', function (req, res) {
        res.render('pages/index')
    })
    .get('/about', function (req, res) {
        res.render('pages/about')
    })
    .get('/book', async function (req, res) {
        const table = await getTableOfContents()
        res.render('pages/book', { table })
    })
    .get('/book/:ch(\\d+)', async function (req, res) {
        const chapter = req.params.ch
        const sections = await getChapter(chapter)
        const table = await getTableOfContents()
        if (sections[0]?.title) {
            res.render('pages/section', { sections, chapter, table })
        } else {
            res.redirect('/book')
        }
    })
    .listen(port, () => { console.log(`app listening on port ${port}`) })