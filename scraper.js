import axios from 'axios'
import cheerio from 'cheerio'

const KDENLIVE_URL = 'https://kdenlive.org'
const KDENLIVE_BLOG = '/en/blog/'
const INVENT_URL = 'https://invent.kde.org'
const KDENLIVE_COMMITS = '/multimedia/kdenlive/-/commits/'
const KDENLIVE_ISSUES = '/multimedia/kdenlive/-/issues/'

async function getDOM(url) {
	let res = await axios.get(url)
	return cheerio.load(res.data)
}

async function getIssue(props = { offset: 0 }) {
	let url = `${INVENT_URL}${KDENLIVE_ISSUES}`
	let $ = await getDOM(url)

	let issueEl = $('li.issue')[props.offset]
	let titleEl = $(issueEl).find('.issue-title-text a')
	let infoEl = $(issueEl).find('.issuable-info')
	let authorEl = $(infoEl).find('.author-link')

	let issue = {}
	let author = {}

	issue.url = `${INVENT_URL}${titleEl.attr('href')}`
	issue.title = titleEl.text().trim()
	issue.id = $(infoEl).find('.issuable-reference').text().trim()
	issue.datetime = $(infoEl).find('time').attr('datetime')

	author.name = authorEl.text().trim()
	author.username = authorEl.attr('data-username')
	author.profileUrl = `${INVENT_URL}${authorEl.attr('href')}`

	issue.author = author
	return issue
}

async function getBlogPost(props = { offset: 0 }) {
	let url = `${KDENLIVE_URL}${KDENLIVE_BLOG}`
	let $ = await getDOM(url)

	let articleEl = $('article.et_pb_post')[props.offset]
	let titleEl = $(articleEl).find('.entry-title a')
	let contentEl = $(articleEl).find('.post-content-inner')

	let post = {}
	post.title = titleEl.text().trim()
	post.url = titleEl.attr('href')
	post.content = contentEl.text().trim()

	return post
}

async function getCommit(props = { offset: 0, branch: 'master' }) {
	let url = `${INVENT_URL}${KDENLIVE_COMMITS}/${props.branch}`
	let $ = await getDOM(url)

	let commitEl = $('.commit')[props.offset]
	let titleEl = $(commitEl).find('.commit-row-message.item-title')
	let authorEl = $(commitEl).find('.commit-author-link')
	
	let commit = {}
	let author = {}

	commit.message = titleEl.text().trim()
	commit.url = `${INVENT_URL}${titleEl.attr('href')}`
	commit.shaShort = $(commitEl).find('.commit-sha-group').text().trim()
	commit.datetime = $(commitEl).find('.js-timeago').attr('datetime')

	author.name = authorEl.text().trim()
	author.username = authorEl.attr("href").replace("/", "")
	author.profileUrl = `${INVENT_URL}/${author.username}`

	commit.author = author
	return commit
}

export default { getIssue, getBlogPost, getCommit }