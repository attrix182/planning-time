import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private cloudFireStore: AngularFirestore) {}

  Insert(collectionName: string, data: any) {
    data.id = this.cloudFireStore.createId();
    return this.cloudFireStore.collection(collectionName).doc(data.id).set(data);
  }

  ReturnFirestore() {
    return this.cloudFireStore;
  }

  InsertCustomID(collectionName: string, idCustom: any, data: any) {
    return this.cloudFireStore.collection(collectionName).doc(idCustom).set(data);
  }

  GetAll(collectionName: string) {
    return this.cloudFireStore
      .collection(collectionName)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          })
        )
      );
  }

  GetByParameter(collection: string, parametro: string, value: any) {
    return this.cloudFireStore
      .collection<any>(collection, (ref) => ref.where(parametro, '==', value))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          })
        )
      );
  }

  Update(id: string, collectionName: string, data: any) {
    return this.cloudFireStore
      .collection(collectionName)
      .doc(id)
      .update({ ...data });
  }

  DeleteColecction(collectionName: string): any {
    return this.cloudFireStore
      .collection(collectionName)
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  }

  Delete(collectionName: string, id: string) {
    return this.cloudFireStore.collection(collectionName).doc(id).delete();
  }
}
