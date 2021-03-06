import { Injectable, EventEmitter } from '@angular/core';
import { Queue } from '../models/queue';
import { Http, Headers} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class QueueService {

  constructor(private _http: Http) { }


  queueMembers: Queue[] = [];


  getMembers() {
    return this._http.get('/queue-api')
    .map(response => {
      const data = response.json().obj;
      //objects is an array of queue objects
      let objs: any[] = [];
      for (let i = 0; i < data.length; i++) {
        let queue = new Queue( data[i].name, data[i].reason, data[i].bank, false, data[i].branch,data[i]._id);
        objs.push(queue)
      };
      return objs;
    })
      .catch(error => Observable.throw(error.json()));
  };


  addMember(queueMember: Queue) {
    const body = JSON.stringify(queueMember);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    // return this._http.post('https://thedaruma.github.io/MEANQueue/queue'+token, body, {headers: headers})
    return this._http.post('/queue-api' + token, body, { headers: headers })
      .map(response => {
        const data = response.json().obj;
        console.log(data);
        let queue = new Queue(data.name, data.reason, data.bankId, data.concluded, data.branchId, data._id);
        return queue;
      })
      .catch(error => Observable.throw(error.json()));

  }



  removeMember(queueMember: Queue) {
    console.log(queueMember);
    this.queueMembers.splice(this.queueMembers.indexOf(queueMember), 1);
    const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token'):'';
    console.log(queueMember);
    return this._http.delete(`/queue-api/${queueMember.queueId}`);

  }

}
