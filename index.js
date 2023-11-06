"use strict";

const { decode } = require("html-entities");

module.exports = function logChat(mod) {

	const chatChannels = {
		"say": 0,
		"party": 1,
		"guild": 2,
		"area": 3,
		"trade": 4,
		"greet": 9,
		"private": [11, 12, 13, 14, 15, 16, 17, 18],
		"p-notice": 21,
		"emote": 26,
		"global": 27,
		"r-notice": 25,
		"raid": 32,
		"megaphone": 213,
		"guild-adv": 214
	};

	mod.command.add("lc", {
		"$none": () => {
			mod.settings.enabled = !mod.settings.enabled;
			mod.command.message(`Module ${mod.settings.enabled ? "enabled" : "disabled"}`);
		},
		"$default": arg => {
			if (mod.settings[arg] === undefined) {
				return mod.command.message("Invalid chat section.");
			}
			mod.settings[arg] = !mod.settings[arg];
			mod.command.message(`Type ${arg}: ${mod.settings[arg] ? "enabled" : "disabled"}`);
		}
	});

	mod.hook("S_WHISPER", "*", { "filter": { "fake": null } }, sChat);
	mod.hook("S_CHAT", "*", { "filter": { "fake": null } }, sChat);
	mod.hook("S_PRIVATE_CHAT", "*", { "filter": { "fake": true } }, sChat);

	function sChat(event) {
		if (!mod.settings.enabled) return;

		let type = "whisper";

		if (event.authorID !== undefined && event.authorName !== undefined && event.authorID === 0n && event.authorName === "") {
			type = "toolbox";
		}

		if (event.channel !== undefined) {
			type = getChannelType(event.channel);
		}

		if (mod.settings[type] === undefined || mod.settings[type] === false) {
			return;
		}

		const message = `[${type}]${event.name ? ` ${event.name}` : ""}: ${decode(event.message.replace(/<[^>]*>?/gm, ""))}`;

		if (mod.game.me.is(event.gameId)) {
			console.log(">>>", message);
		} else {
			console.log("<<<", message);
		}
	}

	function getChannelType(channel) {
		for (const [type, channels] of Object.entries(chatChannels)) {
			if ((Array.isArray(channels) && channels.includes(channel)) || channel == channels) {
				return type;
			}
		}

		return false;
	}
};