const resolverArticle = require('./article')
const resolverComment = require('./comment')

module.exports = {
	Query: {
		...resolverArticle.Query,
		...resolverComment.Query
	},
	Mutation: {
		...resolverArticle.Mutation,
		...resolverComment.Mutation
	}
}
