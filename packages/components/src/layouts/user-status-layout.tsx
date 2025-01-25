import { currentUserQuery } from "@repo/lib/queries/current-user-query"
import { forumWsClient } from "@repo/shared/api/forum-client"
import { useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { toast } from "sonner"

type UserStatusLayoutProps = {
  children: React.ReactNode
}

type PushNotifications = {
  type: "accept-friend-request" | "create-friend-request"
  payload: {
    recipient: string
    initiator: string
  }
}

async function pushNotifications({
  payload, type
}: PushNotifications) {
  const { initiator, recipient } = payload;
  const navigate = useNavigate()

  switch (type) {
    case "create-friend-request":
      toast.info("Новое уведомление", {
        description: `Пользователь ${initiator} хочет добавить вас в друзья`,
        action: {
          label: "Перейти",
          onClick: () => {
            navigate({ to: `/friends` })
          }
        }
      });
      break;
    case "accept-friend-request":
      toast.info("Новое уведомление", {
        description: `Пользователь ${recipient} принял вашу заявку в друзья`,
      });
      break;
  }
}

export const UserStatusLayout = ({
  children
}: UserStatusLayoutProps) => {
  const { nickname } = currentUserQuery().data

  console.log(nickname)

  useEffect(() => {
    const ws = forumWsClient.ws["user-status"].$ws();

    const connect = async () => {
      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: "status", status: "online", nickname
        }));
      };

      ws.onclose = () => {
        ws.send(JSON.stringify({
          type: "status", status: "offline", nickname
        }));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case "accept-friend-request":
            return pushNotifications(message)
          case "create-friend-request":
            return pushNotifications(message)
          case "ping":
            ws.send(JSON.stringify({ type: "pong", nickname }));
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "status", status: "offline", nickname }));
      }

      ws.close();
    }
  }, []);

  return children
}