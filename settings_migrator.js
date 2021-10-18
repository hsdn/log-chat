/* eslint-disable no-param-reassign, comma-dangle */
"use strict";

const DefaultSettings = {
	"enabled": true,
	"whisper": true,
	"toolbox": false,
	"say": true,
	"party": true,
	"guild": true,
	"area": true,
	"trade": false,
	"greet": false,
	"private": true,
	"p-notice": true,
	"emote": false,
	"global": true,
	"r-notice": true,
	"raid": true,
	"megaphone": true,
	"guild-adv": false
};

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
	if (from_ver === undefined) return { ...DefaultSettings, ...settings };
	else if (from_ver === null) return DefaultSettings;
	else {
		from_ver = Number(from_ver);
		to_ver = Number(to_ver);

		if (from_ver + 1 < to_ver) {
			settings = MigrateSettings(from_ver, from_ver + 1, settings);
			return MigrateSettings(from_ver + 1, to_ver, settings);
		}

		const oldsettings = settings;

		switch (to_ver) {
			default:
				settings = Object.assign(DefaultSettings, {});

				for (const option in oldsettings) {
					if (settings[option] !== undefined) {
						settings[option] = oldsettings[option];
					}
				}
		}

		return settings;
	}
};