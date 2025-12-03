import { AddNotificationEvent } from "../types/AddNotificationEvent";

export function addNotification(
  message: string,
  type: "error" | "success" | "warning" = "success"
) {
  const event = new CustomEvent<AddNotificationEvent>("notification:add", {
    detail: { message, type },
  });
  window.dispatchEvent(event);
}
