import {
  syncLongestRunNotification,
  syncFastestPaceNotification,
  syncHighestElevationNotification,
  syncBiggestWeekNotification,
  syncBiggestMonthNotification,
  syncBiggestYearNotification,
  syncRaceRecordNotification,
  syncHeartRateRecordNotification,
} from "./recordNotificationService";
export async function syncRunRecords() {
  await syncLongestRunNotification();

  await syncFastestPaceNotification();

  await syncHighestElevationNotification();

  await syncBiggestWeekNotification();

  await syncBiggestMonthNotification();

  await syncBiggestYearNotification();
}
await syncRaceRecordNotification(5);

await syncRaceRecordNotification(10);

await syncRaceRecordNotification(15);

await syncRaceRecordNotification(
  21.097
);

await syncRaceRecordNotification(
  42.195
);

await syncHeartRateRecordNotification(
  0,
  130
);

await syncHeartRateRecordNotification(
  131,
  140
);

await syncHeartRateRecordNotification(
  141,
  150
);

await syncHeartRateRecordNotification(
  151,
  160
);