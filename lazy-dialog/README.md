# Lazy Loader for Dialogs
@wizdm/lazy-dialog implements lazy loading for [Angular Material Dialogs](https://material.angular.io/components/dialog/overview) in the same way the Router does for feature modules.

## Installation
Use `npm` to install the @wizdm/lazy-dialog module:

```
npm install @wizdm/lazy-dialog
```

## Usage 
Import the `LazyDialogLoader` service and use it as a (CanActivate guard)[https://angular.io/api/router/CanActivate] within the routes you want to associate with your dialogs:

``` typescript
import { LazyDialogLoader } from '@wizdm/lazy-dialog';
...
const routes: Routes = [

  { 
    path: 'home', component: HomeComponent, children: [
      ...
      
      { 
        path: 'login', 
        canActivate: [ LazyDialogLoader ],
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
      },

  ]}
...
];
```

Use `login` as a regular link in your template:

``` html
...
  <a routerLink="login">Login</a>
...
```

### Dialog Module
For the lazily loading to occur, the dialog must be wrapped in a module following the very same pattern of a regular lazily loaded feature module:

``` typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
...
import { LoginComponent } from './login.component';

/** Dialog route. This route will be used by the LazyDialogLoader, emulating the router, to lazily load the dialog */
const routes: Routes = [{
  path: '',
  component: LoginComponent,
  data: { dialogConfig: { width: 350, maxWidth: '100%' }}
}];

@NgModule({

  declarations: [ LoginComponent ],  

  imports: [
    CommonModule,
    MatDialogModule,
    ...,
    RouterModule.forChild(routes)
  ]
})
export class LoginModule { }
``` 

Be sure to always include the `MatDialogModule` within your dialog module since it is crucial for the loader to work properly.
 
By including a `dialogConfig` object within the route data, the dialog can be [fully configured](https://material.angular.io/components/dialog/api#MatDialogConfig).

In this example, the `LoginComponent` implements the dialog following the very same `Material Dialog` conventions:

``` typescript
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
...
@Component({
  selector : 'wm-login-dlg',
  templateUrl : './login.component.html',
  styleUrls : ['./login.component.scss']
})
export class LoginComponent {
  
  constructor(@Inject(MAT_DIALOG_DATA) private data: LoginData, private ref: MatDialogRef<LoginData, User>) {
    ... 
  }

  /** Closes the dialog returning the logged-in user, if any */
  public close(user: User) {
    this.ref.close(user);
  }
```

## Open a dialog programmatically
In the event you need to get access to the returned value from the dialog, you can open the dialog programmatically:

```typescript 
import { LazyDialogLoader } from '@wizdm/lazy-dialog';
...
export class HomeComponent implements OnDestroy {

  constructor(private loader: LazyDialogLoader) { }
  ...
  public login() {

    this.loader.open('login').then( user => {

      console.log('Logged-in', user);

    });
  }
}
```
Alternatively, you can achieve the same result by using the `LazyDialogDirective` instead:

```html
  <a openDialog="login" (dialogClosed)="doSomething($event)">Login</a>
```

## How It Works
The `LazyDialogLoader` works as a `CanActivate` routing guard preventing the navigation and displaying the dialog instead. The loader seeks for the dialog module within the routes, loads the module, seeks for the dialog component, executes the resolvers, if any, and opens the dialog.
