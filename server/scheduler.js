import cron from "node-cron";
import { User } from "./model/User.js";
import { sendEmail } from "./tools.js";
import { getTextGpt } from "./openai.js";
import { emailSignature } from "./email.js";

const scheduledActions = {};

export const scheduleAction = async (action, schedule, userId) => {
    const user = await User.findById(userId);
    if (!user) {
        return "User not found";
    }

    const task = cron.schedule(schedule === "hourly" ? "0 * * * *" : "0 0 * * *", async () => {
        try {
            const userInfo = [...user.info.entries()].map(([key, value]) => `${key}: ${value}`).join(", ");
            const result = await getTextGpt(
                `User information: ${userInfo} Please execute user requested action (do the task, don't request it but do YOURSELF): ${action}`,
                0.2,
                null,
                null,
                userId,
                "gpt-3.5-turbo",
                true
            );
            const actionTimestamp = Date.now();
            user.scheduling.set(`${schedule}_action_${actionTimestamp}`, action);
            user.scheduling.set(`${schedule}_result_${actionTimestamp}`, result);
            await user.save();

            await sendEmail(user.email, `${schedule} action result`, result + emailSignature, userId);
        } catch (error) {
            console.error(`Error executing scheduled action: ${error}`);
        }
    });

    scheduledActions[userId] = task;
    return `Action "${action}" scheduled to run ${schedule}`;
};

export const stopScheduledAction = (userId) => {
    const task = scheduledActions[userId];
    if (task) {
        task.stop();
        delete scheduledActions[userId];
        return "Scheduled action stopped";
    } else {
        return "No scheduled action found for this user";
    }
};
