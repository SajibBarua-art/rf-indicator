export const RF_INDICATOR_FEATURES = {
  Create: 'can_create_indicator',
  Edit: 'can_update_indicator',
  View: 'can_view_indicator',
};

export const RF_INDICATOR_TABLES = {
  List: 'rf-indicator-list-table',
};

export const RF_INDICATOR_COMMANDS = {
  Create:
    'Bits.RFIndicator.Application.Commands.Indicator.CreateIndicatorCommand',
  Update:
    'Bits.RFIndicator.Application.Commands.Indicator.UpdateIndicatorCommand',
  EditPublish:
    'Platform.BEP.Application.Commands.QuestionCreation.EditQuestionsCommand',
  EditDraft:
    'Platform.BEP.Application.Commands.QuestionCreation.EditQuestionsAsDraftCommand',
  StatusUpdate:
    'Bits.RFIndicator.Application.Commands.Indicator.ChangeIndicatorStatusCommand',
};

export const RF_INDICATOR_QUERY_TEMPLATES = {
  List: 'rf-indicator-query',
  Details: 'rf-indicator-query',
  BreakDownDetails: 'breakdown-indicator-query',
};

export const RF_INDICATOR_STATUS = {
  Published: 1,
  Draft: 2,
};

export const RF_INDICATOR_STATUS_SUCCESS_KEY = {
  Draft: 'QuestionsDraftSaved',
};

export const INDICATOR_TYPES = [
  { Value: 1, DisplayName: 'Output' },
  { Value: 2, DisplayName: 'Outcome' },
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
