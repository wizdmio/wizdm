import { Injectable } from '@angular/core';
//import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
//import { map } from 'rxjs/operators';

export interface mlFormFields {

    field: string;
    value: string;
}

@Injectable()
export class MailerliteService {

  private urlWebforms: string;

  constructor(private http: HttpClient) { 

    //  Use the link from config
    this.urlWebforms = '//app.mailerlite.com/webforms/submit/';
  }

  /**** Usage ****

    let fields: mlFormFields[] = [
    {
      field: 'name',
      value: 'John'
    },
    {
      field: 'family',
      value: 'Doe'
    },
    {
      field: 'email',
      value: 'John.Doe@gmail.com'
    }];
    ...
    this.ml.postForm('w3r2o2', fields).then(() => {...})
  */
  public postForm(code: string, fields: mlFormFields[]) : Promise<string>
  {
    //let headers = new Headers({'Content-Type': 'application/X-www-form-urlencoded'});
    //let options = new RequestOptions({ headers: headers });

    const options = { headers: new HttpHeaders({'Content-Type': 'application/X-www-form-urlencoded'}) };

    // Prepare the body encoding the fields and terminating with the ml-submit=1
    // Notee that MailerLite fields are in the form 'fields[key]=value'
    let body = fields
               .map(field => { return 'fields%5B' + field.field + '%5D=' + encodeURIComponent(field.value);})
               .join('&') + '&ml-submit=1';

    console.log('mailerlite-post URL : ' + this.urlWebforms + code);
    console.log('mailerlite-post BODY: ' + body);
  
    // Post the Http request converting the returned Observable in a Promise to 
    // simplify the management considering is a single request (not a stream) 
    return this.http.post<string>(this.urlWebforms + code, body, options)
               //.pipe(map( res => res.toString() ))
               .toPromise();
  }
}
