import Scraper from './scraper.js'
import Formatter from './formatter.js'
import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
dotenv.config()

let toSendCommits = []
let toSendPosts = []

let lastCommit = {}
let lastPost = {}

async function update() {
	let commit = await Scraper.getCommit()
	let post = await Scraper.getBlogPost()

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

async function sendCommit(userId, commit) {
	let formattedMessage = Formatter.formatCommit(commit)
	await bot.telegram.sendMessage(userId, formattedMessage)
}

async function sendPost(userId, post) {
	let formattedMessage = Formatter.formatPost(post)
	await bot.telegram.sendMessage(userId, formattedMessage)
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
	bot.command("commits", onCommandCommits)
	bot.command("posts", onCommandPosts)
	bot.launch()
	console.log("Running...")
})() 
