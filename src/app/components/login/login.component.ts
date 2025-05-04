import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  userService = inject(UserService)
  router = inject(Router)

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.userService.getAll().subscribe({
      next(data) {
        console.log(data)
        
      },
    })
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;
    this.userService.login(email, password).subscribe(users => {
      if (users.length > 0) {
        localStorage.setItem('user', JSON.stringify(users[0]));
        this.loginForm.reset()
        alert("aqui")
        this.router.navigate(['/home']);
      } else {
        alert("Invalidos")
        console.log('Credenciais inválidas');
        this.loginForm.reset()
      }
    });
  }

  signup(){
    this.router.navigate(["/signup"])
  }
}
