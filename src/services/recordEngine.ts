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

import {
  shouldCheckWeekRecord,
  shouldCheckMonthRecord,
  shouldCheckYearRecord,
} from "../utils/recordSchedule";

export async function syncRunRecords() {
  await syncLongestRunNotification();

  await syncFastestPaceNotification();

  await syncHighestElevationNotification();

  if (shouldCheckWeekRecord()) {
    await syncBiggestWeekNotification();
  }

  if (shouldCheckMonthRecord()) {
    await syncBiggestMonthNotification();
  }

  if (shouldCheckYearRecord()) {
    await syncBiggestYearNotification();
  }

  await syncRaceRecordNotification(5);

  await syncRaceRecordNotification(10);

  await syncRaceRecordNotification(15);

  await syncRaceRecordNotification(21.097);

  await syncRaceRecordNotification(42.195);

  // À mon avis on supprimera ces notifications ensuite
  await syncHeartRateRecordNotification(0, 130);
  await syncHeartRateRecordNotification(131, 140);
  await syncHeartRateRecordNotification(141, 150);
  await syncHeartRateRecordNotification(151, 160);
}