export type AddNotificationEvent = {
  message: string;
  type: "error" | "success" | "warning";
};