import puppeteer from 'puppeteer'
import express from 'express'
import path from 'path'
import fs from 'fs'
import multer from './upload'

const app = express()

app.use(express.static(path.resolve('view')))

app.use('/up', express.static(path.resolve('uploaded/')))

app.get('/fileTest/:file', (req, res) => {
	let html = fs.readFileSync(path.resolve('test.html')).toString()
	html = html.replace('*file*', '/up/'+req.params.file)
	res.send(html)
})

app.post('/upload', multer, async (req, res) => {
	console.log(`http://localhost:3000/fileTest/${req.file.filename}`)

	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto(`http://localhost:3000/fileTest/${req.file.filename}`)
	await page.evaluate(() => {
		document.querySelector('#verify').click()
	})
	let ret = await page.evaluate(() => {
		return {
			result: document.querySelector('#result').innerText.toString(),
		}
	})
	if(ret.result === 'true'){
		console.log('deleted', ret)
		fs.unlinkSync(req.file.path)
		await browser.close()
		res.send('<h1>Photo with Nudity Detected</h1>')
	} else {
		console.log(ret)
		await browser.close()
		fs.unlinkSync(req.file.path)
		res.send('<h1>Photo whitout Nudity</h1>')
	}

})

app.listen('3000', () => {
	console.log('Listening on http://localhost:3000')
})