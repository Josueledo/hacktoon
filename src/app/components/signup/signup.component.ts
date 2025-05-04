import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  loginForm: FormGroup;
  userService = inject(UserService)
  router = inject(Router)
  users:any = []

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirm: ['', Validators.required]
    });
  }
  

  ngOnInit() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data
      },error:(err) => console.log(err)
    })
  }

  onSubmit() {
    const {nome, email, password,confirm } = this.loginForm.value;
    const user = 
    {
      "id": this.users.length + 1,
      "nome": nome,
      "email": email,
      "password": password,
      "pontos": 0,
      "nivel": 0
    }
    if(password === confirm){
      this.userService.createUser(user).subscribe({
        next:(data) =>{
          localStorage.setItem('user', JSON.stringify(user));
          this.loginForm.reset()
          this.router.navigate(["/home"])

        }
      })
    }else{
      alert("senhas erradas")
    }
  }
  login(){
    this.router.navigate(["/login"])
  }
}
