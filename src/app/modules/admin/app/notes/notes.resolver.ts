import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, catchError, throwError } from 'rxjs';
import { NotesService } from './notes.service';

// @Injectable({
//   providedIn:'root'
// })
// export class TagsResolver implements Resolve<any>{
//   constructor(private _notesService:NotesService){
//   }
//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//     debugger;
//     return this._notesService.getTags();
//   }
// }


