import { Component } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { LoginComponent } from '../components/login/login.component'; // Ensure the path is correct



export const userExitGuard: CanDeactivateFn<LoginComponent > = (component, currentRoute, currentState, nextState) => {
  
  // 3. Conditional Check
  // Check if the component exists and has the 'canExit' method
  if (component && component.hasUnsavedData) {
    
    // Call the component's method to determine if exiting is allowed
    const canExitFromComponent = component.hasUnsavedData();

    if (!canExitFromComponent) {
      // If the component says no (e.g., form is dirty), show the confirmation
      return window.confirm("You have unsaved changes. Are you sure you want to exit?");
    }
  }


  return true;
};