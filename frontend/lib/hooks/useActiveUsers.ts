import { useMemo } from 'react';
import { useOthers, useMyPresence, client } from '../liveblocks/config';
import type { ActiveUser } from '../../types';

export function useActiveUsers() {
  const others = client ? useOthers() : [];
  const [myPresence] = client ? useMyPresence() : [{ 
    userAddress: null, 
    cursor: null, 
    selectedColor: null, 
    isDrawing: false, 
    userName: null 
  }];

  // Convert Liveblocks presence data to ActiveUser format
  const activeUsers = useMemo(() => {
    const users: ActiveUser[] = [];

    // Add other users
    others.forEach((other) => {
      if (other.presence.userAddress) {
        users.push({
          address: other.presence.userAddress,
          cursor: other.presence.cursor,
          selectedColor: other.presence.selectedColor,
          isDrawing: other.presence.isDrawing,
          userName: other.presence.userName || undefined,
        });
      }
    });

    // Add current user if they have an address
    if (myPresence.userAddress) {
      users.push({
        address: myPresence.userAddress,
        cursor: myPresence.cursor,
        selectedColor: myPresence.selectedColor,
        isDrawing: myPresence.isDrawing,
        userName: myPresence.userName || undefined,
      });
    }

    return users;
  }, [others, myPresence]);

  // Get users currently drawing
  const drawingUsers = useMemo(() => {
    return activeUsers.filter(user => user.isDrawing);
  }, [activeUsers]);

  // Get users with visible cursors
  const usersWithCursors = useMemo(() => {
    return activeUsers.filter(user => user.cursor !== null);
  }, [activeUsers]);

  // Get count of online users
  const onlineCount = activeUsers.length;

  // Get current user info
  const currentUser = useMemo(() => {
    if (!myPresence.userAddress) return null;
    
    return {
      address: myPresence.userAddress,
      cursor: myPresence.cursor,
      selectedColor: myPresence.selectedColor,
      isDrawing: myPresence.isDrawing,
      userName: myPresence.userName || undefined,
    };
  }, [myPresence]);

  // Check if a specific user is online
  const isUserOnline = (userAddress: string) => {
    return activeUsers.some(user => user.address === userAddress);
  };

  // Get user by address
  const getUserByAddress = (userAddress: string) => {
    return activeUsers.find(user => user.address === userAddress);
  };

  return {
    activeUsers,
    drawingUsers,
    usersWithCursors,
    onlineCount,
    currentUser,
    isUserOnline,
    getUserByAddress,
  };
}