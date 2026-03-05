import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ConfirmModalComponentComponent } from '../../components/confirm-modal-component/confirm-modal-component.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component'; // Ajusta la ruta según tu proyecto
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { HasRoleDirective } from '../../auth/directives/has-role.directive';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarComponent,
    NavbarComponent,
    ConfirmModalComponentComponent,
    SpinnerComponent,
    HasRoleDirective
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;
  statusUser: boolean= true;
  statusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' }
];
  roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'user', label: 'Usuario' }
];
  // Estados de la interfaz
  imagePreview: string | ArrayBuffer | null = null;
  showModalUpdate: boolean = false;
  showModal: boolean = false;
  showModalExit: boolean = false;
  loading: boolean = true;
  visibleSpinner: boolean = false;

  // Mensajes de alerta
  alertText: string = '';
  alertTextOK: string = '';
  dataToSend: any;
  constructor(
    private fb: FormBuilder,
    public _userService: UserService,
    private route: ActivatedRoute
) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
    const userRole:string = localStorage.getItem('user_data')!;
    if (!userRole.includes('admin')) {
    this.userForm.get('roles')?.disable();
    this.userForm.get('isActive')?.disable();
    this.userForm.get('membershipStart')?.disable();
    this.userForm.get('membershipEnd')?.disable();
    // Incluso puedes deshabilitar todo el formulario si prefieres
    // this.userForm.disable();
  }
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      password: [''], // Opcional en actualización
      roles: ['user', Validators.required],
      isActive: ['active', Validators.required],
      membershipStart: [''],
      membershipEnd: [''],
    });
  }

  loadUserData(): void {
     const token = localStorage.getItem('token')
    if (token) {
    this._userService.getUser().subscribe({
   next: (data) => {
    console.log('data',data)
  const user = Array.isArray(data) ? data[0] : data;
    console.log('user : ',user)

  const formattedData = {
    ...user,
    // Reemplazamos el espacio por 'T' para que JS lo reconozca como fecha válida
    membershipStart: user.membershipStart ? user.membershipStart.replace(' ', 'T').split('T')[0] : '',
    membershipEnd: user.membershipEnd ? user.membershipEnd.replace(' ', 'T').split('T')[0] : '',
    isActive: user.isActive ? 'active' : 'inactive',
    roles: user.roles.includes('admin')? 'admin': 'user'

  };
  this.dataToSend= formattedData

  this.userForm.patchValue(formattedData);
    console.log('form data : ',formattedData)
},
      error: (err)=> {
 this.alertText='error al cargar el usuario actual'
      },
    })
    }

  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Lógica para Actualizar
  executeActionUpdate(): void {
    this.showModalUpdate = false;
    this.visibleSpinner = true;
    console.log(this.dataToSend)
    this.updateUser()


  }

  // Lógica para Eliminar
  executeAction(): void {
    this.showModal = false;
    this.visibleSpinner = true;


    setTimeout(() => {
      this.visibleSpinner = false;
      this.showModalExit = true; // Mostrar modal de éxito al eliminar
    }, 1500);
  }

  comeBack(): void {
    this.showModalExit = false;
    // Lógica para redirigir, ej: this.router.navigate(['/users-list']);
    console.log('Redirigiendo a la lista de usuarios...');
  }
updateUser(): void {
  if (this.userForm.invalid) return;

  // 1. Obtenemos todos los valores del formulario
  const rawValue = this.userForm.getRawValue();

  // 2. Creamos el objeto EXACTO que espera el DTO del Backend
  const updateData = {
    name: rawValue.name,
    lastname: rawValue.lastname,
    // TRANSFORMACIÓN: de string 'active' a boolean true
    isActive: rawValue.isActive === 'active',
    // TRANSFORMACIÓN: de string 'admin' a array ['admin']
    roles: [rawValue.roles],
    membershipStart: rawValue.membershipStart,
    membershipEnd: rawValue.membershipEnd,
    // Solo enviamos password si tiene contenido
    ...(rawValue.password ? { password: rawValue.password } : {})
  };

  console.log('Objeto corregido enviado al Back:', updateData);

  this.visibleSpinner = true;

  // 3. Enviamos el ID por URL y la data limpia en el Body
  this._userService.updateUser(updateData).subscribe({
    next: (res) => {
      this.visibleSpinner = false;
      this.alertTextOK = '¡Actualizado con éxito!';
    },
    error: (err) => {
      this.visibleSpinner = false;
      this.alertText = 'Error de validación: ' + JSON.stringify(err.error.message);
    }
  });
}
}
