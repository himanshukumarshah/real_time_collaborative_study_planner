import Session from "../models/session.js";
import Room from "../models/room.js";

export async function getUserSessions(req, res) {
    try {
        const userId = req.user.userId;

        const sessions = await getTodaySessions(userId);

        const sessionCount = sessions.length;
        let totalSessionDuration = 0;

        for (const s of sessions) {
            totalSessionDuration += s.duration;
        }

        return res.status(200).json({
            sessionCount,
            totalSessionDuration
        });
    } catch (err) {
        console.error("Fetching user sessions error", err);
        return res.status(500).json("Internal Server Error");
    }

}

export async function getUserRooms(req, res) {
    try {
        const userId = req.user.userId;

        const sessions = await getTodaySessions(userId);

        const roomIds = [
            ...new Set(sessions.map(s => s.roomId)),
        ];

        const rooms = await Room.find({
            _id: { $in: roomIds }
        })
            .select('_id roomName participants isSessionActive')
            .sort({recentSessionStart: -1})
            .lean();

        return res.status(200).json(rooms);
    } catch (err) {
        console.error("Fetching user rooms error", err);
        return res.status(500).json("Internal Server Error");
    }
}

const getTodaySessions = async (userId) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    return Session.find({
        userId,
        startTime: {
            $gte: startOfToday,
            $lt: startOfTomorrow,
        },
        status: "completed",
    })
        .select("_id roomId startTime duration")
        .lean();
};
