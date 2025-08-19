import { Feature } from './feature.type';

export type Role = {
  Id: string;
  RoleId: string;
  RoleUniqName: string;
  RoleDisplayName: string;
  Description: string;
  Features: Feature[];
  IsDynamic: boolean;
  ParentRoles: string[];
  IsActive: boolean;
  CreatedDate: string;

  // Payload fields
  FeatureIds?: string[];
  FeatureIdsToBeRemoved?: string[];
  FeatureIdsToBeAdded?: string[];
  UsersToBeAdded?: UserStaffInfo[];
  UsersToBeRemoved?: string[];
  PinNumbersToBeRemoved?: string[];
  PinNumbersToBeAdded?: {};
  PinNumbers?: string[];
};

export type UserStaffInfo = {
  Id: string;
  PinNumber: string;
  Username: string;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  BkashNumber: string;
  JobLevel: string;
  DateOfBirth?: string;
  Age: number;
  DemarcationName: string;
  DemarcationId: string;
  Designation: string;
  Sex: string;
  Religion: string;
  JoiningDate: string;
};
