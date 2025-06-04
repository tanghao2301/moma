import { Injectable } from '@angular/core';
import { doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  getUserDocById(firestore: any, id: string): any {
    return doc(firestore, `user/${id}`);
  }

  getUserById(firestore: any, id: string): Observable<any> {
    const userDoc = this.getUserDocById(firestore, id);
    return docData(userDoc, { idField: 'id' }) as Observable<any>;
  }
}
