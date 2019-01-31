import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

export default multer({
	dest: path.resolve('uploaded'),
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, path.resolve('uploaded'))
		},
		filename: (req, file, cb) => {
			crypto.randomBytes(16, (err, hash) => {
				if(err)
					cb(err)
				let type = file.originalname.split('.')
				type = type[type.length - 1]
				const fileName = `${hash.toString('hex')}.${type}`
				cb(null, fileName)
			})
		}
	}),
	fileFilters: (req, file, cb) => {
		const allow = ['image/jpeg', 'image/pjpeg', 'image/png']
		if(allow.includes(file.mimetype)){
			cb(null, true)
		} else {
			cb(new Error('Invalid Type'))
		}
	}
}).single('file')