export type RFIndicatorViewModel = {
  _id: string;
  Id: string;
  ClassInfo: {
    ClassId: string;
    ClassName: string;
  };
  SubjectInfo: {
    SubjectId: string;
    SubjectName: string;
  };
};

export type QuestionEntryDraftViewModel = Omit<RFIndicatorViewModel, 'Draft'>;

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
export type RFIndicatorCommandPayload = {
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
