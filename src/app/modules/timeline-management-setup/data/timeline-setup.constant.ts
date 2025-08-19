export const TIMELINE_SETUP_FEATURES = {
  Create: 'can_create_timeline',
  Edit: 'can_update_timeline',
  View: 'can_view_questions',
};

export const TIMELINE_SETUP_TABLES = {
  List: 'timeline-setup-list-table',
};

// I Need to chang all of these

export const TIMELINE_SETUP_COMMANDS = {
  Create:
    'Bits.RFIndicator.Application.Commands.TimelineManagement.AddTimelineScheduleCommand',
  Update:
    'Bits.RFIndicator.Application.Commands.TimelineManagement.UpdateTimelineScheduleCommand',
  EditPublish:
    'Platform.BEP.Application.Commands.QuestionCreation.EditQuestionsCommand',
  EditDraft:
    'Platform.BEP.Application.Commands.QuestionCreation.EditQuestionsAsDraftCommand',
  StatusUpdate:
    'Bits.TimelineSetup.Application.Commands.Indicator.ChangeIndicatorStatusCommand',
  Delete:
    'Bits.TimelineSetup.Application.Commands.Indicator.DeleteIndicatorCommand',
};

export const TIMELINE_SETUP_QUERY_TEMPLATES = {
  List: 'timeline-setup-query',
  Details: 'timeline-setup-query',
};

export const TIMELINE_SETUP_STATUS = {
  Published: 1,
  Draft: 2,
};

export const TIMELINE_SETUP_STATUS_SUCCESS_KEY = {
  Draft: 'QuestionsDraftSaved',
};

export const INDICATOR_TYPES = [
  { Value: 1, DisplayName: 'Output' },
  { Value: 2, DisplayName: 'OutCome' },
  { Value: 3, DisplayName: 'Impact' },
];
export const DATA_NATURE_OPTIONS = [
  { value: 1, label: 'Number' },
  { value: 2, label: 'Percentage' },
];

export const DATA_FREQUENCIES = [
  { value: 1, label: 'Monthly' },
  { value: 2, label: 'Quarterly' },
  { value: 3, label: 'Half Yearly' },
  { value: 4, label: 'Yearly' },
];
export const REPORTING_FREQUENCIES = [
  { value: 1, label: 'Monthly' },
  { value: 2, label: 'Quarterly' },
  { value: 3, label: 'Half Yearly' },
  { value: 4, label: 'Yearly' },
];
