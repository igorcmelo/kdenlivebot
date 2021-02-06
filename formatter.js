import moment from 'moment'

let regex = /(\-|\+|\(|\)|\.|\#)/gm

function escape(content) {
	if (typeof content == 'object')
		for (let [key, value] of Object.entries(content))
			content[key] = escape(value)
	
	if (typeof content == 'string')
		return content.replace(regex, '\\$&')
	
	return content
}

function formatIssue(issue) {
	let titleLink = `[${escape(issue.title)}](${issue.url})`
	let id = escape(`(${issue.id})`)
	let authorLink = `[${escape(issue.author.username)}](${issue.author.profileUrl})`
	let timeAgo = moment(issue.datetime).fromNow()

	return (
		`Issue: ${titleLink} ${id}\n` +
		`— by ${authorLink}, _${timeAgo}_`
	)
}

function formatCommit(commit) {
	let messageLink = `[${escape(commit.message)}](${commit.url})`
	let authorLink = `[${escape(commit.author.username)}](${commit.author.profileUrl})`
	let timeAgo = moment(commit.datetime).fromNow()

	return (
		`Commit: ${messageLink} \\(${commit.shaShort}\\)\n` +
		`— by ${authorLink}, ${timeAgo}`
	)
}

function formatPost(post) {
	let titleLink = `[${escape(post.title)}](${post.url})`
	let authorLink = `[${escape(post.author.name)}](${post.author.postsUrl})`

	// if was posted today, it says "today"
	let now = moment(new Date())
	let timeAgo = "today"
	if (now.diff(post.date, 'days'))
		timeAgo = moment(post.date).fromNow()

	let meta = `— by ${authorLink}, _${timeAgo}_`
	let content = escape(post.content)
	let readMore = `[READ MORE](${post.url})`
	
	return (
		`News: ${titleLink}\n` +
		`${meta}\n\n` + 
		`${content}\n\n` + 
		`${readMore}`
	)
}

export default { formatIssue, formatCommit, formatPost }