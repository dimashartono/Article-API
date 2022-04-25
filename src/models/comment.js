const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema(
	{
		comment: {
			type: String,
			required: true
		},
		articleId: {
			type: String,
			required: true,
			ref: 'article'
		}
	},
	{ 
        timestamps: true 
    }
)



module.exports = mongoose.model('comment', commentSchema)
