import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { UserService } from "../../services/user.service";

// has-role.directive.ts
@Directive({ selector: '[appHasRole]' , standalone: true})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole!: string; // El rol requerido para ver el botón

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: UserService
  ) {}

  ngOnInit() {
    if (this.authService.hasRole(this.appHasRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
