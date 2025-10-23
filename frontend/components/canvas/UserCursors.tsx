'use client';

import { useActiveUsers } from '../../lib/hooks/useActiveUsers';

interface UserCursorProps {
  address: string;
  cursor: { x: number; y: number };
  selectedColor: string | null;
  userName?: string;
}

function UserCursor({ address, cursor, selectedColor, userName }: UserCursorProps) {
  const displayName = userName || `${address.slice(0, 6)}...`;
  const cursorColor = selectedColor || '#3b82f6';

  return (
    <div
      className="absolute pointer-events-none z-10 transition-all duration-100"
      style={{
        left: cursor.x,
        top: cursor.y,
        transform: 'translate(-2px, -2px)',
      }}
    >
      {/* Cursor pointer */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="drop-shadow-sm"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={cursorColor}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      
      {/* User name label */}
      <div
        className="absolute top-5 left-2 px-2 py-1 text-xs text-white rounded shadow-lg whitespace-nowrap"
        style={{ backgroundColor: cursorColor }}
      >
        {displayName}
      </div>
    </div>
  );
}

export function UserCursors() {
  const { usersWithCursors, currentUser } = useActiveUsers();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {usersWithCursors.map((user) => {
        // Don't show cursor for current user
        if (user.address === currentUser?.address) return null;
        
        if (!user.cursor) return null;

        return (
          <UserCursor
            key={user.address}
            address={user.address}
            cursor={user.cursor}
            selectedColor={user.selectedColor}
            userName={user.userName}
          />
        );
      })}
    </div>
  );
}