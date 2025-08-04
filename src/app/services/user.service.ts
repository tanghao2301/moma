import { inject, Injectable } from '@angular/core';
import { doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { UserModel } from '@models/user.model';
import { User } from 'firebase/auth';
import { defer, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firebaseService: FirebaseService = inject(FirebaseService);

  getUserId(): string{
    return JSON.parse(localStorage.getItem('user')!)?.uid;
  }

  getUserDocById(id: string): any {
    return doc(this.firebaseService.firestore, 'user', id);
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

  updateUserById(id: string, userInfo: User | UserModel): Observable<any> {
    return defer(async () => {
      await updateDoc(this.getUserDocById(id), userInfo);
      return userInfo;
    });
  }
}
