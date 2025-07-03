import { inject, Injectable } from '@angular/core';
import { doc, getDoc, setDoc } from '@angular/fire/firestore';
import { User } from 'firebase/auth';
import { defer, Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _authService!: AuthService;

  private get authService(): AuthService {
    if (!this._authService) {
      this._authService = inject(AuthService);
    }
    return this._authService;
  }

  getUserDocById(id: string): any {
    return doc(this.authService.firestore, 'user', id);
  }

  // getUserById(id: string): Observable<any> {
  //   // use firebase's docData() will live listener
  //   // use getDoc to get only current data
  //   return docData(this.getUserDocById(id), {
  //     idField: 'uid',
  //   }) as Observable<any>;
  // }

  getUserById(id: string): Observable<any | null> {
    const userRef = this.getUserDocById(id);
    return defer(() =>
      getDoc(userRef).then((snap) => {
        return snap.exists() ? { uid: snap.id, ...(snap.data() ?? {}) } : null;
      })
    );
  }

  setUserById(id: string, userInfo: User | UserModel): Observable<any> {
    return defer(async () => {
      const user = {
        uid: userInfo.uid,
        name: userInfo.displayName,
        email: userInfo.email,
        photoURL: userInfo.photoURL,
      };
      await setDoc(this.getUserDocById(id), user);
      return user;
    });
  }
}
