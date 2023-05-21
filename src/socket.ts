import { Socket, io } from "socket.io-client";

interface ClientToServerEvents {}

interface ServerToClientEvents {
  request_transfer: (data: { to: string; productId: string }) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_APP_BASE_URL as string,
  {
    transports: ["websocket"],
    autoConnect: false,
    query: {
      account: localStorage.getItem("account"),
    },
  }
);
