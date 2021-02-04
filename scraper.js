import axios from 'axios'
import cheerio from 'cheerio'

const COMMIT_URL_PREFIX = 'https://invent.kde.org/multimedia/kdenlive/-/commits'

async function getDOM(url) {
	let res = await axios.get(url)
	return cheerio.load(res.data)
}

async function getCommit(props = { offset: 0, urlPrefix: COMMIT_URL_PREFIX, branch: 'master' }) {
	let url = `${props.urlPrefix}/${props.branch}`
	let $ = await getDOM(url)

	let commitEl = $('.commit')[offset]
	let titleEl = $(commitEl).find('.commit-row-message.item-title')
	let authorEl = $(commitEl).find('.commit-author-link')
	
	let commit = {}
	let author = {}

	commit.message = titleEl.text().trim()
	commit.url = titleEl.attr('href')
	commit.shaShort = $(commitEl).find('.commit-sha-group').text().trim()
	commit.datetime = $(commitEl).find('.js-timeago').attr('datetime')

	author.name = authorEl.text().trim()
	author.username = authorEl.attr("href").replace("/", "")
	author.profileUrl = 'https://invent.kde.org/' + author.username

	commit.author = author
	return commit
}