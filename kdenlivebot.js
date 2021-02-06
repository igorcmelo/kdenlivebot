import Scraper from './scraper.js'
import Formatter from './formatter.js'
import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
dotenv.config()

let toSendIssues = []
let toSendCommits = []
let toSendPosts = []

let lastIssue = {}
let lastCommit = {}
let lastPost = {}

async function update() {
	let issue = await Scraper.getIssue()
	let commit = await Scraper.getCommit()
	let post = await Scraper.getBlogPost()

	if (issue.url != lastIssue.url) {
		toSendIssues.forEach((userId) => {
			sendIssue(userId, issue)
		})
		lastIssue = issue
	}

	if (commit.url != lastCommit.url) {
		toSendCommits.forEach((userId) => {
			sendCommit(userId, commit)
		})
		lastCommit = commit
	}

	if (post.url != lastPost.url) {
		toSendPosts.forEach((userId) => {
			sendPost(userId, post)
		})
		lastPost = post
	}
}

async function sendFormatted(userId, message) {
	await bot.telegram.sendMessage(userId, message, { parse_mode: 'MarkdownV2' })
}

async function sendIssue(userId, issue) {
	let formattedMessage = Formatter.formatIssue(issue)
	await sendFormatted(userId, formattedMessage)
}

async function sendCommit(userId, commit) {
	let formattedMessage = Formatter.formatCommit(commit)
	await sendFormatted(userId, formattedMessage)
}

async function sendPost(userId, post) {
	let formattedMessage = Formatter.formatPost(post)
	await sendFormatted(userId, formattedMessage)
}

async function onCommandIssues(ctx) {
	let userId = ctx.message.from.id
	await sendIssue(userId, lastIssue)
	if (! toSendIssues.includes(userId))	
		toSendIssues.push(userId)
}

async function onCommandCommits(ctx) {
	let userId = ctx.message.from.id
	await sendCommit(userId, lastCommit)
	if (! toSendCommits.includes(userId))	
		toSendCommits.push(userId)
}

async function onCommandPosts(ctx) {
	let userId = ctx.message.from.id
	await sendPost(userId, lastPost)
	if (! toSendPosts.includes(userId))
		toSendPosts.push(ctx.message.from.id)
}

const bot = new Telegraf(process.env.BOT_TOKEN);

(async () => {
	await update()
	setInterval(update, process.env.UPDATE_INTERVAL)
	bot.start()
	bot.command("issues", onCommandIssues)
	bot.command("commits", onCommandCommits)
	bot.command("posts", onCommandPosts)
	bot.launch()
	console.log("Running...")
})() 
