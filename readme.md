# INLINE SELECT PARA IONIC 2

Componente para ionic que muestra botones horizontales con scroll para seleccionar.

- Instalar:

```
npm install --save github:4rsoluciones/inline-select
```

- Recordar que para que compile las dependencia propias (librerías de 4r) se debe modificar el archivo *tsconfig.json*:
```ts
...
"include": [
    "src/**/*.ts",
    "node_modules/@4r/**/*.ts"
  ],
  "exclude":[
    "/node_modules(?!(\/|\\)@4r)/"
  ],
  ...
]
...
```

- Importar el módulo en cada módulo en el que se quiera utilizar

```ts
import {InlineSelectModule} from "@4r/horizontal-spinner/inline-select.module";

@NgModule({
	...
    imports: [
		  InlineSelectModule,
    ]
	...
})
```

El componente `inline-select` es similar al `<ion-select>` y al `<select>` de HTML. Pero las opciones se muestran 
en un scroll horizontal sin necesidad de abrir un diálogo.

El componente inline select toma componentes hijos `inline-option`. Este componente debe tener `value` como atributo. 
Tambien acepta los atributos `disabled` y `selected`. Y lanza el evento `inlineSelect` con el `value` cuando 
es seleccionado.

Si se vincula `ngModel` a `inline-select`, el valor seleccionado será de acuerdo a el o los valores pasados en el modelo.
También se puede setear el atributo `selected` en los componentes `inline-option`.

### Single Value

El `inline-select` standard permite al usuario seleccionar un sólo una opción. El valor del componente `inline-select` 
recibe el valor del `value` de la opción seleccionada. Cuando no hay ninguna seleccionada el valor es `undefined` o `[]`.

```html
<ion-item>
  <ion-label stacked>Gender</ion-label>
  <inline-select item-content [(ngModel)]="gender" (ionChange)="genderSelected($event)">
    <inline-option value="f">
      <ion-icon name="female"></ion-icon>
      Female
    </inline-option>
    <inline-option value="m">
      <ion-icon name="male"></ion-icon>
      Male
    </inline-option>
  </inline-select>
</ion-item>
```

### Multiple Value

Agregando el atributo `multiple` al `inline-select`, los usuarios pueden seleccionar múltiples opciones. 
El valor del componente `inline-select multiple` recibe un arreglo con todos los valores de las opciones seleccionadas. 
En el ejemplo abajo, como las opciones no tienen `value` se toma el texto como valor. No funcionará correctamente si 
hay otros elementos dentro del `inline-option`.

```html
<ion-item>
  <ion-label stacked>Toppings</ion-label>
  <inline-select item-content [(ngModel)]="toppings" (ionChange)="toppingsSelected($event)" multiple>
    <inline-option>Bacon</inline-option>
    <inline-option>Black Olives</inline-option>
    <inline-option>Extra Cheese</inline-option>
    <inline-option>Mushrooms</inline-option>
    <inline-option>Pepperoni</inline-option>
    <inline-option>Sausage</inline-option>
  </inline-select>
</ion-item>
```

### Object Value References

When using objects for select values, it is possible for the identities of these objects to
change if they are coming from a server or database, while the selected value's identity
remains the same. For example, this can occur when an existing record with the desired object value
is loaded into the select, but the newly retrieved select options now have different identities. This will
result in the select appearing to have no value at all, even though the original selection in still intact.

Using the `compareWith` `Input` is the solution to this problem

```html
<ion-item>
  <ion-label>Employee</ion-label>
  <inline-select [(ngModel)]="employee" [compareWith]="compareFn">
    <inline-option *ngFor="let employee of employees" [value]="employee">{{employee.name}}</inline-option>
  </inline-select>
</ion-item>
```

```ts
compareFn(e1: Employee, e2: Employee): boolean {
  return e1 && e2 ? e1.id === e2.id : e1 === e2;
}
```
