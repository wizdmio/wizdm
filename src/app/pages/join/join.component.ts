import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
//import { Http, Headers, RequestOptions, Response } from '@angular/http';
//import { Observable } from 'rxjs';

@Component({
  selector: 'rs-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {

  constructor(//private http: Http, 
              private route: ActivatedRoute) { }

  ngOnInit() {
/*
    this.route.queryParamMap.subscribe((params: Params) => {

      let code  = params.get("code");
      let error = params.get("error");
      let desc  = params.get("error_description");
      let state = params.get("state");

      console.log("Linkedin? code: " + code + " - state: " + state); 
    });*/
  }
/*
  private randomString( len ) {
    let str = "";
    for(let i = 0; i < len; i++){
      let rand = Math.floor( Math.random() * 62 );
      str += String.fromCharCode( rand += rand > 9 ? (rand < 36 ? 55 : 61) : 48 );
    }
    return str;
  }

  private join() {
/*
    let headers = new Headers({'Content-Type': 'application/X-www-form-urlencoded'});
    let options = new RequestOptions({ headers: headers });

    let url = "https://www.linkedin.com/oauth/v2/authorization";

    url += "?response_type=code";
    url += "&client_id=771i6xd4hbby1f";
    url += "&redirect_uri=" + encodeURIComponent("http://localhost:4200/en/join");
    url += "&state=" + this.randomString(16);

    window.location.href = url;

  /*  
    this.http.get(url).subscribe((res: Response) => {

      console.log(res.toString);

    }, error => {

      console.log("error: " + error);
    } );*/
  //} 
}
