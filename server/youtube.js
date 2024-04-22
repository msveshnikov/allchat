import { google } from "googleapis";
import { getTextClaude } from "./claude.js";
import dotenv from 'dotenv';
dotenv.config();

const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_KEY,
});

export const summarizeYouTubeVideo = async (videoId) => {
    try {
        const captionResponse = await youtube.captions.list({
            videoId,
            part: "snippet",
        });

        const captions = captionResponse.data.items
            .map(
                (item) =>
                    item.snippet.trackKind === "ASR" && item.snippet.language === "en" && item.snippet.isTranslatable
            )
            .filter(Boolean)
            .map((item) => item.id);

        if (!captions.length) {
            return "No captions found for this video";
        }

        const captionTracksResponse = await youtube.captions.download({
            videoId,
            id: captions,
            tfmt: "srt",
        });

        const captionText = Buffer.from(captionTracksResponse.data).toString("utf-8");
        const summary = await getTextClaude(
            `Summarize the following in 100 words:\n\n${captionText}`,
            0.5,
            null,
            null,
            null,
            "claude-3-haiku-20240307",
            null,
            false
        );

        return summary;
    } catch (error) {
        console.error("Error summarizing YouTube video:", error);
        return "Error summarizing YouTube video";
    }
};
