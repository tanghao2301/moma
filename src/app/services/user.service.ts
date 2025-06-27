import { Injectable } from '@angular/core';
import { doc, getDoc, setDoc } from '@angular/fire/firestore';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  getUserDocById(firestore: any, id: string): any {
    return doc(firestore, 'user', id);
  }

  // getUserById(firestore: any, id: string): Observable<any> {
  //   // use firebase's docData() will live listener
  //   // use getDoc to get only current data
  //   return docData(this.getUserDocById(firestore, id), {
  //     idField: 'uid',
  //   }) as Observable<any>;
  // }

  getUserById(firestore: any, id: string): Promise<any | null> {
    const userRef = this.getUserDocById(firestore, id);
    return getDoc(userRef).then((snap) => {
      return snap.exists() ? { uid: snap.id, ...(snap.data() ?? {}) } : null;
    });
  }

  async setUserById(firestore: any, id: string, userInfo: User): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = {
          uid: userInfo.uid,
          name: userInfo.displayName,
          email: userInfo.email,
          photoURL: userInfo.photoURL,
        };
        await setDoc(this.getUserDocById(firestore, id), user);
        resolve(user);
      } catch (error) {
        reject(error);
        throw error;
      }
    });
  }
}
