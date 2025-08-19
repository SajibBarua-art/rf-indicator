export type OptionsCategories = {
  Id: string;
  Value: string;
};

export type InstituteTypes = {
  Id: string;
  Value: string;
};

export type LocationList = {
  Id: string;
  Name: string;
  Category: string;
  HierarchyName: string;
  SourceId: string;
  ParentId: string;
  InstituteTypes: string[];
};

export type UserRole = {
  Id: string;
  Value: string;
};
export interface RegionLocation {
  Id: string;
  Name: string;
  SourceId: string;
  HierarchyId?: string;
  ParentId: string;
}

export interface RegionResponse {
  ListOfLocation: RegionLocation[];
  Success: string;
  Message: string;
}

export type ConfigurationBreakdown = {
  IndicatorId: string;
  OperationCategoryId: string;
  InstituteTypeId: string;
  LayerBreakdowns: [
    {
      IndicatorNumber: string;
      IndicatorStatement: string;
      SourceTypeId: number;
      SourceId: string;
    },
  ];
  LocationCongiuration: {
    DivisionIds: string[];
    DistrictIds: string[];
    UpazilaIds: string[];
  };
  DataMaker: {
    UserCategoryId: string;
    UserCategory: string;
  };
  DataChecker: {
    UserCategoryId: string;
    UserCategory: string;
  };
  FieldValidators: {
    UserCategoryId: string;
    UserCategory: string;
  };
  HeadOfficeValidators: {
    UserCategoryId: string;
    UserCategory: string;
  };
};
