export const BotNotInVoiceChannelError = new Error(
	'I am not in a voice channel.'
);

export const BotInVoiceChannelError = new Error(
	'I am already in a voice channel.'
);

export const UserNotInVoiceChannelError = new Error(
	'You are not in a voice channel.'
);

export const UserInVoiceChannelError = new Error(
	'You are already in a voice channel.'
);

export const StageSupportError = new Error(
	'I do not support stage channels yet.'
);

export const NoArgumentsProvidedError = new Error(
	'You did not include enough arguments.'
);

export const NotPlayingError = new Error('I am not playing anything.');

export const VolumeNotInRangeError = new Error('That volume is not in range.');
