import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import type { ActionData } from '@wizdm/actionlink';
import { StorageService } from '@wizdm/connect/storage';
import { StorageFolder } from '@wizdm/connect/storage/extras';
import { AuthService } from "@wizdm/connect/auth";

export interface FolderData extends ActionData { 
  path?: string;
  title?: string;
  none?: boolean;
};

@Component({
  selector: 'wm-folder-dlg',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent extends StorageFolder {

  private selectedFileUrl: string = 'none';  
  //public loading: string;

  public get selectedFile(): string {
    return this.selectedFileUrl !== 'none' ? this.selectedFileUrl : '';
  }

  constructor(@Inject(MAT_DIALOG_DATA) readonly data: FolderData, private dlg: MatDialogRef<string>, store: StorageService, auth: AuthService) {

    super(store, data.path || auth.userId);

    //dlg.updateSize('100%', '100%');
  }

  public selectFile(url: string): void {
    this.selectedFileUrl = url;
  }

  public isFileSelected(url: string): boolean {
    return this.selectedFileUrl === url;
  }

  public deleteFile(url: string) {

    this.st.fromURL(url).delete();

    this.selectedFileUrl = 'none';

    this.ls('.');
  }

  public close(url: string) {
    this.dlg.close(this.selectedFileUrl = url)
  }

  private readAsDataUrl(file: Blob): Promise<string> {

    return new Promise( (resolve, reject) => {

      const fd = new FileReader();

      fd.onerror = () => reject(fd.error);

      fd.onload = () => resolve(fd.result as string);

      fd.readAsDataURL(file);
    });
  }

  public uploadFile(file: File) {

    this.readAsDataUrl(file).then( data => {

      const img = new Image();

      img.onload = () => {

        const resize = (source: HTMLImageElement|HTMLCanvasElement, size: number) => {     

          const ratio = Math.min(Math.sqrt(source.width * source.height / size), 2);
          const canvas = document.createElement('canvas');
          canvas.width = source.width / ratio;
          canvas.height = source.height / ratio;
          const ctx = canvas.getContext('2d');
        
          ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

          return (canvas.width * canvas.height > size) ? resize(canvas, size) : canvas;
        }
        
        const thumbnail = resize(img, 64);

        this.upload(file, { customMetadata: { 
          
          thumb: thumbnail.toDataURL("image/png"),
          width: img.naturalWidth.toString(),
          height: img.naturalHeight.toString()
        }});

      }

      img.src = data;
    });
  }
}
