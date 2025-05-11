import { useEffect, useRef } from "react";

import socket from "../ws/socket";
import type { Location, User } from "../types/user";

const calculateNewLocation = (currentLocation: Location | null) => {
  if (!currentLocation) return { lat: 0.5, lng: 0.5 };

  const speed = 0.5;
  const deltaLat = (Math.random() - 0.5) * speed;
  const deltaLng = (Math.random() - 0.5) * speed;

  const newLat = currentLocation.lat + deltaLat;
  const newLng = currentLocation.lng + deltaLng;

  return {
    lat: Math.max(0, Math.min(1, newLat)),
    lng: Math.max(0, Math.min(1, newLng)),
  };
};

type UseFakeWalkProps = (
  eventData: { userId: string; walkId?: string; event: string },
  updateUsers: (users: User[]) => void
) => void;

const INTERVAL = 500;

const useFakeWalk: UseFakeWalkProps = (eventData, updateUsers) => {
  const locationRef = useRef<Location | null>(null);

  useEffect(() => {
    socket.on(eventData.event, (updatedUsers: User[]) => {
      updateUsers(updatedUsers);
    });

    const interval = setInterval(() => {
      const newLocation = calculateNewLocation(locationRef.current);
      locationRef.current = newLocation;
      socket.emit(eventData.event, { newLocation, ...eventData });
    }, INTERVAL);

    return () => {
      clearInterval(interval);
      socket.off(eventData.event);
    };
  }, [eventData, updateUsers]);
};

export default useFakeWalk;
