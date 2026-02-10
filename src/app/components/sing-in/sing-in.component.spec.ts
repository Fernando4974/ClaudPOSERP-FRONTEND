import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { SingInComponent } from './sing-in.component';
import { UserService } from '../../services/user.service';

describe('SingInComponent', () => {
  let component: SingInComponent;
  let fixture: ComponentFixture<SingInComponent>;
  let userServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Creamos mocks (versiones simuladas) de los servicios para aislar el componente
    userServiceMock = jasmine.createSpyObj('UserService', ['singIn']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SingInComponent, FormsModule],
      // Proveemos los mocks en lugar de los servicios reales
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SingInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('no debería registrar al usuario si los campos están vacíos', () => {
    spyOn(window, 'alert');
    component.addUser();
    expect(window.alert).toHaveBeenCalledWith('Datos incomprelos');
    expect(userServiceMock.singIn).not.toHaveBeenCalled();
  });

  it('no debería registrar al usuario si las contraseñas no coinciden', () => {
    spyOn(window, 'alert');
    // Asignamos valores a todos los campos para que pase la primera validación
    component.name = 'Test';
    component.lastname = 'User';
    component.email = 'test@test.com';
    component.password = 'pass123';
    component.repeatpassword = 'pass456';
    component.credentials = '1';

    component.addUser();
    expect(window.alert).toHaveBeenCalledWith('Contraseñas no coinciden');
    expect(userServiceMock.singIn).not.toHaveBeenCalled();
  });

  it('debería registrar al usuario si los datos son correctos', () => {
    // Simulamos la respuesta exitosa del servicio
    userServiceMock.singIn.and.returnValue(of({}));
    spyOn(window, 'alert');

    // Asignamos datos válidos al componente para pasar ambas validaciones
    component.name = 'Test';
    component.lastname = 'User';
    component.email = 'test@test.com';
    component.password = 'pass123';
    component.repeatpassword = 'pass123';
    component.credentials = '1';

    component.addUser();

    // Verificamos que el servicio se haya llamado con los datos correctos
    expect(userServiceMock.singIn).toHaveBeenCalledWith({
      name: 'Test',
      lastname: 'User',
      email: 'test@test.com',
      password: 'pass123',
      credentials: 1,
    });
    // Verificamos que se haya mostrado la alerta de éxito
    expect(window.alert).toHaveBeenCalledWith('registrado:Test');
  });

  it('debería manejar errores de registro', () => {
    // Simulamos un error del servicio
    userServiceMock.singIn.and.returnValue(throwError(() => new Error('Error de registro')));
    spyOn(window, 'alert');
    
    // Asignamos datos válidos al componente para que la llamada al servicio se ejecute
    component.name = 'Test';
    component.lastname = 'User';
    component.email = 'test@test.com';
    component.password = 'pass123';
    component.repeatpassword = 'pass123';
    component.credentials = '1';

    component.addUser();

    // Verificamos que el servicio se haya llamado, y que la alerta de éxito no
    // se haya disparado debido al error simulado.
    expect(userServiceMock.singIn).toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalledWith('registrado:Test'); 
  });
});