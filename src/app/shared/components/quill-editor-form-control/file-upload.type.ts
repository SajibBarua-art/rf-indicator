export interface FileMetaData {
  Description: string;
}

export interface FilePayloadInfos {
  FolderId: string;
  FileId: string;
  Name: string;
  AccessType: string;
  MetaData: FileMetaData;
}

export interface CreateStorageFilePayload {
  CorrelationId: string;
  FileInfos: FilePayloadInfos[];
}

export interface GetFileUploadUriPayload {
  CorrelationId: string;
  FileIds: string[];
  PageNumber: number;
  PageSize: number;
  DoCount: boolean;
  Source: string;
  Filter: string;
  Fields: string[];
  Descending: boolean;
  OrderBy: string;
}
