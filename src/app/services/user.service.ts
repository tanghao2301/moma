import { Injectable } from '@angular/core';
import { doc, docData, setDoc } from '@angular/fire/firestore';
import { User } from 'firebase/auth';
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

  setUserById(firestore: any, id: string, userInfo: User): void {
    setDoc(this.getUserDocById(firestore, id), {
      uid: userInfo.uid,
      name: userInfo.displayName,
      email: userInfo.email,
      photoURL: userInfo.photoURL,
    });
  }
}
