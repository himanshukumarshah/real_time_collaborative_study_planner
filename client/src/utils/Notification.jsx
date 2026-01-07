import toast from 'react-hot-toast';

export const Notification = (userUpdate) => {
    const state = userUpdate.state; // 'join', 'left', or 'ownerChanged'
    const name = userUpdate?.userName || "Someone";

    // Define theme based on the three possible states
    const getTheme = () => {
        if (state === 'join') {
            return {
                bg: 'bg-emerald-50',
                darkBg: 'dark:bg-emerald-900/20',
                text: 'text-emerald-600',
                border: 'border-emerald-500',
                avatarBg: 'bg-emerald-100',
                icon: '🟢',
                title: 'New Participant',
                message: ' has entered the room.'
            };
        } else if (state === 'ownerChanged') {
            return {
                bg: 'bg-amber-50',
                darkBg: 'dark:bg-amber-900/20',
                text: 'text-amber-600',
                border: 'border-amber-500',
                avatarBg: 'bg-amber-100',
                icon: '👑',
                title: 'Room Host Changed',
                message: ' is now the room owner.'
            };
        } else {
            // Default to 'left' state
            return {
                bg: 'bg-rose-50',
                darkBg: 'dark:bg-rose-900/20',
                text: 'text-rose-600',
                border: 'border-rose-500',
                avatarBg: 'bg-rose-100',
                icon: '🔴',
                title: 'User Left',
                message: ' has left the session.'
            };
        }
    };

    const theme = getTheme();

    const playSound = () => {
        const audio = new Audio("../../notify.mp3");
        audio.volume = 0.2; 
        audio.play().catch(e => console.log("Audio play blocked by browser"));
    };

    playSound();

    toast.custom((t) => (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-sm w-full bg-white dark:bg-gray-800 shadow-2xl rounded-xl pointer-events-auto flex border-l-4 ${theme.border} ring-1 ring-black ring-opacity-5 overflow-hidden`}
        >
            <div className={`flex-1 p-4 ${theme.bg} ${theme.darkBg}`}>
                <div className="flex items-center">
                    {/* Avatar Section */}
                    <div className="shrink-0">
                        <div className={`h-10 w-10 rounded-full ${theme.avatarBg} flex items-center justify-center ${theme.text} font-bold text-lg shadow-sm`}>
                            {name.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="ml-4 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <span>{theme.icon}</span>
                            {theme.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                            <span className="font-medium text-gray-800 dark:text-gray-100">
                                {name}
                            </span>
                            {theme.message}
                        </p>
                    </div>

                    {/* Small Close Button */}
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    ), {
        position: 'bottom-right',
        duration: 3000,
    });
};