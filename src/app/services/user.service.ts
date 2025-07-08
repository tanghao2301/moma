import { Injectable } from '@angular/core';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { defer, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  getUserDocById(firestore: Firestore, id: string): any {
    return doc(firestore, 'user', id);
  }

  // getUserById(id: string): Observable<any> {
  //   // use firebase's docData() will live listener
  //   // use getDoc to get only current data
  //   return docData(this.getUserDocById(id), {
  //     idField: 'uid',
  //   }) as Observable<any>;
  // }

  getUserById(firestore: Firestore, id: string): Observable<any | null> {
    const userRef = this.getUserDocById(firestore, id);
    return defer(() =>
      getDoc(userRef).then((snap) => {
        return snap.exists() ? { uid: snap.id, ...(snap.data() ?? {}) } : null;
      })
    );
  }

  setUserById(firestore: Firestore, id: string, userInfo: any): Observable<any> {
    return defer(async () => {
      let user;
      if (userInfo.uid) {
        user = {
          uid: userInfo.uid,
          name: userInfo.displayName,
          email: userInfo.email,
          photoURL: userInfo.photoURL,
        };
      } else {
        user = userInfo;
      }
      await setDoc(this.getUserDocById(firestore, id), user);
      return user;
    });
  }
}
