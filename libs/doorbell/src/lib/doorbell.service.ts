import { Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DoorbellConfig, DorbellSubmit } from './doorbell.definitions';

export const DoorbellConfigToken = new InjectionToken<DoorbellConfig>('Doorbell configuration token');

@Injectable()
export class DoorbellService {

  constructor(@Inject(DoorbellConfigToken) private config: DoorbellConfig, private http: HttpClient) { 

    if(!config.url || !config.id || !config.key) {
      throw( new Error('DoorbellSerive requires a valid configuration!!!') );
    }
  }

  public ring(): Promise<boolean> {

    return this.http.post(`${this.config.url}/${this.config.id}/open`, '', { 
      headers: { 'Content-Type': 'text/html' },
      params: { 'key': this.config.key },
      observe: 'response',
      responseType: 'text' 
    }).toPromise().then( res => res.status === 201 );
  }

  public submit(body: DorbellSubmit): Promise<boolean> {

    return this.http.post(`${this.config.url}/${this.config.id}/submit`, body, { 
      headers: { 'Content-Type': 'application/json' },
      params: { 'key': this.config.key },
      observe: 'response',
      responseType: 'text' 
    }).toPromise().then( res => res.status === 201 );
  }
}
