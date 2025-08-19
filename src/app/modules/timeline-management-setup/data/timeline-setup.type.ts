export interface EntityReference {
  ItemId: string;
  SourceId: string;
  Value: string;
}

export interface LocationReference {
  ItemId: string;
  SourceId: string;
  Name: string;
}

export interface Frequency {
  Value: number;
  DisplayName: string;
}

export interface DateRangeObject {
  StartDate: string;
  EndDate: string;
}

export interface TimelineSetupViewModel {
  Id: string;
  TimelineId: string;

  OperationCategory: EntityReference;
  InstituteType: EntityReference;
  Division: LocationReference | null;
  District: LocationReference | null;
  Upazila: LocationReference | null;
  Institute: LocationReference | null;

  DateRange: DateRangeObject;
  DataCollectionFrequency: Frequency;
  ReportingFrequency: Frequency;
  DataCollectionDeadlineInDays: number;
  Reason: string;
}

export type QuestionEntryDraftViewModel = Omit<TimelineSetupViewModel, 'Draft'>;

export type QuestionItemViewModel = {
  Id: string;
  SourceId: string;
  QuestionText: string;
  Answer: string;
  Domain: {
    Value: number;
    DisplayName: string;
  }[];
  IsActive: boolean;
  Draft: QuestionItemDraftViewModel;
};

export type QuestionItemDraftViewModel = Omit<QuestionItemViewModel, 'Draft'>;

export type QuestionPayload = {
  QuestionId: string;
  ClassId: string;
  SubjectId: string;
  ChapterId: string;
  TopicId: string;
  QuestionTypeId: string;
  QuestionSubTypeId: string;
  AddItems: QuestionItem[];
  EditItems: QuestionItem[];
  DeleteItems: string[];
  CorrelationId: string;
};

export type QuestionItem = {
  QuestionItemId: string;
  QuestionText: string;
  Answer: string;
  Domain: {
    Value: number;
    DisplayName: string;
  }[];
  IsActive: boolean;

  // Local field
  IsNew: boolean;
};

// This type is used to define the structure of the RF Indicator command payload
export type TimelineSetupCommandPayload = {
  Id: string;
  IndicatorType: IndicatorOptions;
  IndicatorNumber: number;
  Title: string;
  BreakdownLayer: number;
  DataNature: DataNatureOptions;
  DataCollectionFrequency: DataFrequencyOptions;
};
export type DataNatureOptions = {
  Value: number;
  DisplayName: string;
};

export type DataFrequencyOptions = {
  Value: number;
  DisplayName: string;
};
export type IndicatorOptions = {
  Value: number;
  DisplayName: string;
};
