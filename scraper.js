import axios from 'axios'
import cheerio from 'cheerio'

const KDENLIVE_URL = 'https://kdenlive.org'
const KDENLIVE_BLOG = '/en/blog/'
const INVENT_URL = 'https://invent.kde.org'
const KDENLIVE_COMMITS = '/multimedia/kdenlive/-/commits/'

async function getDOM(url) {
	let res = await axios.get(url)
	return cheerio.load(res.data)
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

export default { getCommit }