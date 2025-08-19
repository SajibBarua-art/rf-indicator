export interface BepClass {
  Id: string;
  Code: string;
  Name: string;
  TeacherSalary: string;
  Status: boolean;
  GradeCode: string | null;
}

export interface BepSubject {
  Id: string;
  ClassId: string;
  IsDeleted: string;
  SubjectName: string;
}

export type DropdownOptionType = {
  Key?: any;
  Value: string | number;
  Label: string;
  MetaData?: any;
  SourceId?: string;
};
