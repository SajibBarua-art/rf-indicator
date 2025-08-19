import { Inject, inject, Injectable } from '@angular/core';
import { CreateStorageFilePayload } from './file-upload.type';
import { from, Observable, of, switchMap } from 'rxjs';
import {
  PlatformCommandResponse,
  PlatformCommandService,
  PlatformStorageService,
  UtilityService,
} from '@platform-ui/platform-core/services';
import { map } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class FileUploaderPublicService {
  private _emptyGuid = '00000000-0000-0000-0000-000000000000';

  private xCreateFileCommandName =
    'Platform.Storage.Commands.CreateFilesCommand';
  private readonly _commandService = inject(PlatformCommandService);
  private readonly _utilityService = inject(UtilityService);
  private readonly _storageService = inject(PlatformStorageService);

  constructor(@Inject('config') private config: any) {}

  uploadImage(file: File, isPublic?: boolean): Observable<string> {
    const currentFileId = this._utilityService.getNewGuid();
    const correlationId = this._utilityService.getNewGuid();

    const payload: CreateStorageFilePayload = {
      CorrelationId: correlationId,
      FileInfos: [
        {
          FileId: currentFileId,
          FolderId: this._emptyGuid,
          Name: file.name,
          AccessType: isPublic ? 'Public' : 'Protected',
          MetaData: {
            Description: file.name,
          },
        },
      ],
    };

    return this.initiateCommand(payload).pipe(
      switchMap(objectedRes => {
        const fileId = objectedRes.FileId;
        const uploadUrl: string = objectedRes?.UploadUri?.UploadUriWithSas;
        const fileVersion: string = objectedRes?.Versions?.[0]?.VersionId;
        if (!!uploadUrl && !!fileVersion) {
          return from(this.uploadFile(uploadUrl, file)).pipe(
            switchMap(data => {
              const uploadUrl = data?.url;
              return this._storageService.getFileInfo(fileId).pipe(
                map(fileObj => {
                  return fileObj.uri;
                })
              );
            })
          );
        }

        return of('');
      })
    );
  }

  private initiateCommand(payload: CreateStorageFilePayload): Observable<any> {
    return this._commandService
      .post(this.xCreateFileCommandName, payload, {
        WaitForNotification: true,
        SkipToast: true,
      })
      .pipe(
        map(response => {
          let notification = null;
          if (response.Notification) {
            try {
              notification = JSON.parse(response.Notification?.ResponseValue);
            } catch (e) {
              console.error(response.Notification?.ResponseValue);
            }
          }

          return notification;
        })
      );
  }

  private uploadFile(uploadUrl: string, file: File): Promise<any> {
    return fetch(uploadUrl, {
      method: 'put',
      body: file,
    });
  }
}
