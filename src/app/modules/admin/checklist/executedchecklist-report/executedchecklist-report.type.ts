export class ExecutedChecklistReport {
  leadId: number;
  firstName: string = '';
  executedCheckpoints: number;
  notExecutedCheckpoints?: number;
  executedPercentage?: number;
  overdueCheckpoints?: number;
}