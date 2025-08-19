export const TARGET_SETUP_FEATURES = {
  Create: 'can_create_target',
  Edit: 'can_update_target',
  View: 'can_view_target',
  Delete: 'can_delete_target',
};

export const TARGET_SETUP_TABLES = {
  List: 'target-setup-list-table',
};

export const TARGET_SETUP_QUERY_TEMPLATES = {
  List: 'indicator-target-query',
  Details: 'indicator-target-query',
};

export const TARGET_SETUP_STATUS = {
  Published: 1,
  Draft: 2,
};

export const TARGET_SETUP_STATUS_SUCCESS_KEY = {
  Draft: 'QuestionsDraftSaved',
};

export const TARGET_SETUP_COMMANDS = {
  Create:
    'Bits.RFIndicator.Application.Commands.IndicatorTarget.AddIndicatorTargetCommand',
  Update:
    'Bits.RFIndicator.Application.Commands.IndicatorTarget.UpdateIndicatorTargetCommand',
  Delete:
    'Bits.RFIndicator.Application.Commands.IndicatorTarget.DeleteIndicatorTargetCommand',
};

export const FIELD_CONFIGS = [
  { name: 'targetNumber', label: 'No.' },
  { name: 'targetPercentage', label: '%' },
  { name: 'disaggregationBoys', label: 'Boys/Men' },
  { name: 'disaggregationGirls', label: 'Girls/Women' },
  { name: 'disaggregationTransgender', label: 'Transgender' },
  { name: 'disaggregationPwdBoys', label: 'PWD Boys/Men' },
  { name: 'disaggregationPwdGirls', label: 'PWD Girls/Women' },
  { name: 'disaggregationPwdTransgender', label: 'PWD Transgender' },
  { name: 'source', label: 'Source' },
  { name: 'calculationMethodology', label: 'Methodology' },
];

// Frequency enums for better readability
export enum FrequencyType {
  MONTHLY = 1,
  QUARTERLY = 2,
  HALF_YEARLY = 3,
  YEARLY = 4,
}

// Month enums for better readability
export enum Month {
  JANUARY = 1,
  FEBRUARY = 2,
  MARCH = 3,
  APRIL = 4,
  MAY = 5,
  JUNE = 6,
  JULY = 7,
  AUGUST = 8,
  SEPTEMBER = 9,
  OCTOBER = 10,
  NOVEMBER = 11,
  DECEMBER = 12,
}

// Quarter enums
export enum Quarter {
  Q1 = 1,
  Q2 = 2,
  Q3 = 3,
  Q4 = 4,
}

// Half Year enums
export enum HalfYear {
  H1 = 1,
  H2 = 2,
}

// Quarter month mappings
export const QUARTER_MONTHS = {
  [Quarter.Q1]: [Month.JANUARY, Month.FEBRUARY, Month.MARCH],
  [Quarter.Q2]: [Month.APRIL, Month.MAY, Month.JUNE],
  [Quarter.Q3]: [Month.JULY, Month.AUGUST, Month.SEPTEMBER],
  [Quarter.Q4]: [Month.OCTOBER, Month.NOVEMBER, Month.DECEMBER],
};

// Half Year month mappings
export const HALF_YEAR_MONTHS = {
  [HalfYear.H1]: [
    Month.JANUARY,
    Month.FEBRUARY,
    Month.MARCH,
    Month.APRIL,
    Month.MAY,
    Month.JUNE,
  ],
  [HalfYear.H2]: [
    Month.JULY,
    Month.AUGUST,
    Month.SEPTEMBER,
    Month.OCTOBER,
    Month.NOVEMBER,
    Month.DECEMBER,
  ],
};

const MONTHLY_TIME_PERIOD = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' },
];

const QUATERLY_TIME_PERIOD = [
  { value: 1, label: 'Q1' },
  { value: 2, label: 'Q2' },
  { value: 3, label: 'Q3' },
  { value: 4, label: 'Q4' },
];

const HALF_YEARLY_TIME_PERIOD = [
  { value: 1, label: 'H1' },
  { value: 2, label: 'H2' },
];

export const TIME_PERIOD_FREQUENCY_WISE_TIME_PERIOD = [
  {
    value: FrequencyType.MONTHLY,
    label: 'Monthly',
    timePeriod: MONTHLY_TIME_PERIOD,
  },
  {
    value: FrequencyType.QUARTERLY,
    label: 'Quaterly',
    timePeriod: QUATERLY_TIME_PERIOD,
  },
  {
    value: FrequencyType.HALF_YEARLY,
    label: 'Half Yearly',
    timePeriod: HALF_YEARLY_TIME_PERIOD,
  },
  {
    value: FrequencyType.YEARLY,
    label: 'Yearly',
    timePeriod: [],
  },
];

// Helper functions for frequency type checking
export const isMonthly = (frequency: number): boolean =>
  frequency === FrequencyType.MONTHLY;
export const isQuarterly = (frequency: number): boolean =>
  frequency === FrequencyType.QUARTERLY;
export const isHalfYearly = (frequency: number): boolean =>
  frequency === FrequencyType.HALF_YEARLY;
export const isYearly = (frequency: number): boolean =>
  frequency === FrequencyType.YEARLY;

// Helper functions for quarter and half-year checking
export const isQ1 = (quarter: number): boolean => quarter === Quarter.Q1;
export const isQ2 = (quarter: number): boolean => quarter === Quarter.Q2;
export const isQ3 = (quarter: number): boolean => quarter === Quarter.Q3;
export const isQ4 = (quarter: number): boolean => quarter === Quarter.Q4;

export const isH1 = (halfYear: number): boolean => halfYear === HalfYear.H1;
export const isH2 = (halfYear: number): boolean => halfYear === HalfYear.H2;
