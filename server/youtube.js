import { YoutubeTranscript } from "youtube-transcript";
import { getTextClaude } from "./claude.js";

export const summarizeYouTubeVideo = async (videoId) => {
    try {
        const script = await YoutubeTranscript.fetchTranscript(videoId);
        const captionText = script.map((s) => s.text).join(" ");
        console.log(captionText);
        const summary = await getTextClaude(
            `Summarize the following in 100 words:\n\n${captionText}`,
            0.7,
            null,
            null,
            null,
            "claude-3-haiku-20240307",
            false
        );

        return summary;
    } catch (error) {
        console.error("Error summarizing YouTube video:", error);
        return "Error summarizing YouTube video";
    }
};
