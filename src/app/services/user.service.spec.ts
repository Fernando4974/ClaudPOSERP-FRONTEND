import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment.development';

describe('UserService', () => {
  let servicio: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    servicio = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Este paso es crucial. Verifica que no queden peticiones HTTP pendientes.
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(servicio).toBeTruthy();
  });

  it('debería enviar una solicitud POST para registrar un usuario', () => {
    const usuarioFicticio: User = {
      name: 'Usuario de Prueba',
      lastname:'Apellido Prueba',
      email: 'prueba@ejemplo.com',
      password: 'password123'

    };

    // Nos suscribimos a la llamada del servicio para verificar su respuesta.
    servicio.singIn(usuarioFicticio).subscribe(respuesta => {
      expect(respuesta).toEqual(usuarioFicticio);
    });

    // Esperamos una única solicitud al endpoint específico.
    const req = httpMock.expectOne(`${environment.apiUrl}api/user/register`);

    // Verificamos que el método de la solicitud sea POST.
    expect(req.request.method).toBe('POST');
    // Verificamos que el cuerpo de la solicitud contenga los datos del usuario que enviamos.
    expect(req.request.body).toEqual(usuarioFicticio);

    // Respondemos a la solicitud interceptada con los datos del usuario ficticio.
    req.flush(usuarioFicticio);
  });
});
