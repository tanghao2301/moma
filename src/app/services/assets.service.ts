import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { Asset } from '@models/asset.model';
import { BehaviorSubject, defer, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  private firebaseService: FirebaseService = inject(FirebaseService);
  private assets$ = new BehaviorSubject<Asset[] | null>(null);
  private isLoading$ = new BehaviorSubject<boolean>(false);

  private getAssetsCollection(userId: string) {
    return collection(
      this.firebaseService.firestore,
      'user',
      userId,
      'assets'
    );
  }

  private getAssetDoc(userId: string, assetId: string) {
    return doc(
      this.firebaseService.firestore,
      'user',
      userId,
      'assets',
      assetId
    );
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  getAssets(): Observable<Asset[] | null> {
    return this.assets$.asObservable();
  }

  fetchAssets(userId: string): Observable<Asset[]> {
    this.isLoading$.next(true);
    return defer(async () => {
      try {
        const querySnapshot = await getDocs(this.getAssetsCollection(userId));
        const assets = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Asset),
        }));
        this.assets$.next(assets);
        return assets;
      } finally {
        this.isLoading$.next(false);
      }
    });
  }

  addAsset(userId: string, asset: Asset): Observable<any> {
    return defer(async () => {
      const docRef = await addDoc(this.getAssetsCollection(userId), {
        ...asset,
        lastUpdated: Date.now(),
      });
      await this.fetchAssets(userId).toPromise();
      return docRef;
    });
  }

  updateAsset(userId: string, assetId: string, asset: Partial<Asset>): Observable<any> {
    return defer(async () => {
      await updateDoc(this.getAssetDoc(userId, assetId), {
        ...asset,
        lastUpdated: Date.now(),
      });
      await this.fetchAssets(userId).toPromise();
    });
  }

  deleteAsset(userId: string, assetId: string): Observable<any> {
    return defer(async () => {
      await deleteDoc(this.getAssetDoc(userId, assetId));
      await this.fetchAssets(userId).toPromise();
    });
  }
}
