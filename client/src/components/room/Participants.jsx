// client/src/components/room/Participants.jsx
import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Crown, User } from "lucide-react";

/**
 * Participants component
 *
 * Props:
 *  - participants: [{ userId, userName }]   (required)
 *  - ownerId: string                        (optional) id of room owner
 *
 * Behavior:
 *  - Highlights current user with "You"
 *  - Shows owner badge when ownerId matches a participant
 *  - Orders list as: Owner → You → Others
 */
export default function Participants({
  participants = [],
  ownerId = null,
  isOwnerTemp = false,
}) {
  const { user } = useAuth();
  const myId = user?.id;

  const sorted = useMemo(() => {
    const owner = [];
    const me = [];
    const others = [];

    participants.forEach((p) => {
      if ( !isOwnerTemp && ownerId && p.userId === ownerId) owner.push(p);
      else if (myId && p.userId === myId) me.push(p);
      else others.push(p);
    });

    return [...owner, ...me, ...others];
  }, [participants, ownerId, myId]);

  return (

    <div className="bg-white">
      {/* Header - Already handled by the sidebar container in StudyRoom, 
          but refined here if used standalone */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Live Group
          </h4>
          <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {participants.length}
          </span>
        </div>
      </div>

      <ul className="space-y-1 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
        {sorted.length === 0 && (
          <li className="py-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
            <p className="text-sm text-gray-400">No participants yet</p>
          </li>
        )}

        {sorted.map((p) => {
          const name = p.userName || p.name || "User";
          const initial = name.charAt(0).toUpperCase();
          const isMe = myId && p.userId === myId;
          const isOwner = !isOwnerTemp && ownerId && p.userId === ownerId;

          return (
            <li
              key={p.userId}
              className={`group flex items-center gap-3 p-2 rounded-xl transition-all duration-200 ${isMe ? "bg-indigo-50/50" : "hover:bg-gray-50"
                }`}
            >
              {/* Avatar Wrapper */}
              <div className="relative shrink-0">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm transition-transform group-hover:scale-105 ${isMe
                      ? "bg-indigo-600 text-white shadow-indigo-100"
                      : "bg-white border border-gray-200 text-gray-600"
                    }`}
                >
                  {initial}
                </div>

                {/* Online Status Dot */}
                <span
                  className="absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
                  title="Online"
                />
              </div>

              {/* Name + Labels */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-sm truncate ${isMe ? "font-bold text-gray-900" : "font-medium text-gray-700"
                      }`}
                    title={name}
                  >
                    {name} {isMe && <span className="text-indigo-400 font-normal ml-1">(You)</span>}
                  </span>

                  { isOwner && (
                    <div className="shrink-0 text-amber-500" title="Room Owner">
                      <Crown size={14} fill="currentColor" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    { isOwner ? "Host" : "Student"}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Custom Scrollbar CSS (Add to your global CSS or a style tag) */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}} />
    </div>
  );
}
