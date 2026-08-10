import { getRuns } from "./runService";
import {
  cleanupObsoleteRunRecordNotifications,
  syncNotesNotifications,
  syncRunRecordNotifications,
} from "./recordNotificationService";
import {
  shouldCheckWeekRecord,
  shouldCheckMonthRecord,
  shouldCheckYearRecord,
} from "../utils/recordSchedule";
import type { Run } from "../types/Run";

type RunRecordSyncContext = {
  previousRuns: Run[];
  changedRunId: string;
};

export async function syncRunRecords(
  context?: RunRecordSyncContext
): Promise<void> {
  if (context) {
    const currentRuns = await getRuns();
    const wasExistingRun = context.previousRuns.some(
      (run) => run.id === context.changedRunId
    );

    if (wasExistingRun) {
      await cleanupObsoleteRunRecordNotifications(
        context.changedRunId,
        currentRuns
      );
    }

    await syncRunRecordNotifications({
      previousRuns: context.previousRuns,
      currentRuns,
      changedRunId: context.changedRunId,
      checkWeek: shouldCheckWeekRecord(),
      checkMonth: shouldCheckMonthRecord(),
      checkYear: shouldCheckYearRecord(),
    });
  }

  await syncNotesNotifications();
}
