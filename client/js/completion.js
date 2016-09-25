var commands = [
	"/close",
	"/connect",
	"/deop",
	"/devoice",
	"/disconnect",
	"/invite",
	"/join",
	"/kick",
	"/leave",
	"/mode",
	"/msg",
	"/nick",
	"/notice",
	"/op",
	"/part",
	"/query",
	"/quit",
	"/raw",
	"/say",
	"/send",
	"/server",
	"/slap",
	"/topic",
	"/voice",
	"/whois"
];

export default function complete(state, partialWord) {
	let chan = state.channels[state.activeChannelId];
	let recentSpeakers =
		chan.messages
			.filter(m => (m.type === "message" || m.type === "action") && !m.self)
			.map(m => m.from)
			.reverse();
	let recentSpeakerSet = new Set(recentSpeakers);
	let nicks = chan.users.map(u => u.name).filter(n => !recentSpeakerSet.has(n));
	let chans = [];
	for (let channelId in state.channels) {
		let channel = state.channels[channelId];
		if (channel.type !== "lobby") {
			chans.push(channel.name);
		}
	}

	let words = commands.concat(recentSpeakers).concat(nicks).concat(chans);

	return words.filter(w => w.toLowerCase().indexOf(partialWord.toLowerCase()) === 0);
}
