import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService} from '../../shared/services/auth.service';
import { User } from '../../shared/models/user';
import { Router } from '@angular/router';
import { BranchService} from '../../shared/services/branch.service';
import {Branch } from '../../shared/models/branch';
@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  form:FormGroup;
  branches:Branch[];
  constructor(private _authService: AuthService, private formBuilder: FormBuilder, private router: Router, private _branchService: BranchService) {
    this.form = this.formBuilder.group({
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'email': ['', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]],
      'password': ['', Validators.required],
      'branch': ['', Validators.required]
    })
  }
  onSubmit(){
    const user = new User(
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.email,
      this.form.value.password,
      'Ryan\'s Bank',
      this.form.value.branch );
    this._authService.registerNewUser(user)
    .subscribe(
      data => {
        this.form.reset();
        this._authService.login(user).subscribe(data=>{
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);
          this.router.navigate(['/queue']);
        },
      error=> console.error(error));
      },
      error=> console.error(error)
    );

  }
  isErrorVisible(field:string, error:string){
    return this.form.controls[field].dirty && this.form.controls[field].errors && this.form.controls[field].errors[error];
  }
  ngOnInit() {
    this._branchService.getBranches().subscribe(
      data=>{
        this.branches = data;
      },
      error=>{
        console.error(error)
      }
    )
  }

}
