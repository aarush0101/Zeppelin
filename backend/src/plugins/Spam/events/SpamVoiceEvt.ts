import { RecentActionType, spamEvt } from "../types.js";
import { logAndDetectOtherSpam } from "../util/logAndDetectOtherSpam.js";

export const SpamVoiceStateUpdateEvt = spamEvt({
  event: "voiceStateUpdate",

  async listener(meta) {
    const member = meta.args.newState.member;
    if (!member) return;
    const channel = meta.args.newState.channel;
    if (!channel) return;
    if (channel.id === meta.args.oldState?.channelId) return;

    const config = await meta.pluginData.config.getMatchingConfig({ member, channelId: channel.id });
    const maxVoiceMoves = config.max_voice_moves;
    if (maxVoiceMoves) {
      logAndDetectOtherSpam(
        meta.pluginData,
        RecentActionType.VoiceChannelMove,
        maxVoiceMoves,
        member.id,
        1,
        "0",
        Date.now(),
        null,
        "too many voice channel moves",
      );
    }
  },
});
