import { Component, OnInit } from '@angular/core';
import { StudentService } from './student.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

declare var jquery:any;
declare var $ :any;
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  classActiveResult:boolean = false;
  classActiveError: boolean = false;
  searchForm: FormGroup;
  addStudentForm: FormGroup;
  updateStudentForm: FormGroup;
  students: any;
  selectedStudent: any = null;


  constructor(private studentService: StudentService, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.createSearchForm();
    this.createAddStudentForm();
    this.createUpdateStudentForm();
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      searchKey: ['xiaojun', Validators.required]
    });
  }

  createAddStudentForm() {
    this.addStudentForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  createUpdateStudentForm() {
    this.updateStudentForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required]
    })
  }

  search() {
    if (! this.searchForm.valid) {
      return;
    }

    let name: string = this.searchForm.controls['searchKey'].value;
    this.studentService.findStudentByName(name)
      .then(res => {
        this.classActiveResult = res.classActiveResult;
        console.log(res.students);
        this.students = res.students;
      });
    this.searchForm.reset();  
  }

  add() {
    if (! this.addStudentForm.valid) {
      return;
    }
    this.studentService.addStudent(this.addStudentForm);
    $('#addStudentModal').modal('hide');
  }

  showUpdateModal(event:any, student: any) {
    event.stopPropagation();
    event.preventDefault();
    $('#updateStudentModal').modal('show');
    this.selectedStudent = student;
  }

  updateStudent() {
    if (! this.updateStudentForm.valid) {
      return;
    }

    this.studentService.updateStudent(this.updateStudentForm)
      .then(() => {
        $('#updateStudentModal').modal('hide');
        this.selectedStudent = null;
        this.classActiveResult = false;
      });
  }

  deleteStudent() {
    this.studentService.deleteStudent(this.selectedStudent.id)
    .then(() => {
        $('#updateStudentModal').modal('hide');
        this.selectedStudent = null;
        this.classActiveResult = false;
    })
  }
}
