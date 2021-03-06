import * as Notifications from "expo-notifications";

export async function _setNotificationHandler(
  shouldShowAlert,
  shouldPlaySound,
  shouldSetBadge
) {
  console.log(shouldShowAlert);
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert,
      shouldPlaySound,
      shouldSetBadge,
    }),
  });
}

export async function scheduleNotificationAtSecondsFromNow(
  title,
  body,
  seconds
) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: {
      seconds,
    },
  });

  return identifier;
}

export async function cancelNotification(notificationID) {
  Notifications.cancelScheduledNotificationAsync(notificationID);
}
