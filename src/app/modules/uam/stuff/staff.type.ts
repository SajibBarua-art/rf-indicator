export interface Staff {
  UserName: string;
  StaffId: string;
  AssignedPIN: string;
  Id: string;
  _id: string;
  CreatedBy: string;
  CreatedDate: string; // ISO date format
  StaffPIN: string;
  StaffName: string;
  DateOfBirth: string; // ISO date format
  Age: number;
  Sex: string;
  MobileNo: string | null;
  BKashNo: string | null;
  EmailID: string | null;
  Religion: string;
  EducationID: string | null;
  LastEducation: string | null;
  EducationGroupID: string | null;
  EducationGroupName: string | null;
  JoiningDate: string; // ISO date format
  DesignationID: string;
  DesignationName: string;
  DesignationGroupID: string | null;
  DesignationGroupName: string | null;
  LastPromotionDate: string | null; // ISO date format
  JobLevel: string | null;
  LevelDate: string; // ISO date format
  TransferDate: string; // ISO date format
  JobBase: string;
  Status: string;
  StatusDate: string; // ISO date format
  BloodGroup: string | null;
  ProgramID: number;
  HR_ProgramID: string;
  ProgramName: string;
  ProjectID: number;
  HR_ProjectID: string;
  ProjectName: string;
  DivisionID: number;
  HR_DivisionID: string;
  DivisionName: string;
  DistrictID: number;
  HR_DistrictID: string;
  DistrictName: string;
  UpazilaID: number;
  HR_UpazilaID: string;
  UpazilaName: string;
  BranchID: number;
  HR_BranchID: string;
  BranchName: string;
  RegionID: number | null;
  RegionName: string | null;
  ImageId?: string | null;
  CoreProgramID?: string;
  CoreProgramName?: string;
}

export type NonGroupStaffsQuery = {
  GroupId?: string;
  Descending?: boolean;
  PageSize?: number;
  PageNumber?: number;
  OrderBy?: string;
  SearchValue?: string;
  Filters?: GroupStaffQueryFilterDto;
};

export type GroupStaffQueryFilterDto = {
  Sex?: string;
  JobLevel?: string;
  ProgramID?: number;
  ProjectID?: number;
  DivisionID?: number;
  DistrictID?: number;
  RegionID?: string;
  BranchID?: number;
  BranchName?: string;
};

export type NonGroupStaffsResponse = {
  result: { nonGroupStaffs: any[]; totalCount: number };

  validationResult: {
    errors: string[];
    isValid: boolean;
  };
};
