import moment from 'moment'

function escapeSpecialChars(content) {
	// let regex = new RegExp("")
	// if (typeof content == 'object')
	// 	for (let [key, value] of Object.entries(content))
	// 		content[key] = escapeSpecialChars(value)
	let escaped = content
	return escaped
}

function formatCommit(commit) {
	let escaped = escapeSpecialChars(commit)
	let timeAgo = moment(commit.datetime).fromNow()
	return (
		`Commit: "${escaped.message}" (${escaped.shaShort})\n` +
		`by ${escaped.author.username}, ${timeAgo}\n`
	)
}

function formatPost(post) {
	let escaped = escapeSpecialChars(post)

	return (
		`${escaped.title}\n\n` +
		`${escaped.content}\n\n` + 
		`${escaped.url}` 
	)
}

export default { formatCommit, formatPost }