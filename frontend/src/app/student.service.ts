import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup } from '@angular/forms'
import 'rxjs/add/operator/toPromise';
const url = (endpoint) => `http://localhost:3000/students/${endpoint}`

@Injectable()
export class StudentService {

  constructor(private http: Http) { }

  findStudentByName(name:string) {
    return this.http.get(url(name)).toPromise()
      .then(res => res.json())
      .then(body => {
        let classActiveResult = body.length == 0 ? false : true;
        return { classActiveResult: classActiveResult, students: body};
      })
      .catch(err => {
        console.log(err);
        return {classActiveResult: false, students: []};
      })
  }

  deleteStudent(id: number) {
    return this.http.delete(url(id)).toPromise()
      .then(() => {return {id: id}})
      .catch(err => {
        console.log(err);
        return {id: id};
      })
  }

  addStudent(form: FormGroup) {
    return this.http.post(url(''), form.value).toPromise()
    .then(() => {
      return 'default';
    })
  }

  updateStudent(form: FormGroup) {
    return this.http.put(url(`${form.controls["id"].value}`), form.value).toPromise()
      .then(() => {
        form.reset();
        return 'default';
      })
  }
}
