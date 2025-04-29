import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';


@Injectable()
export class FireBaseService implements OnModuleInit{
    private db: FirebaseFirestore.Firestore;

    onModuleInit() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        })
        this.db = admin.firestore()
    }

    get firestore() {
        return this.db
    }

    async saveMessage(fromId: string,fromUrl: string,fromUserName: string, toId: string, message: string, isRead: false,readBy: string[]){
        
        const chatKey = [fromId,toId].sort().join('_')
        try {
            await this.db.collection('messages').add({
              fromId,
              fromUrl,
              fromUserName,
              toId,
              message,
              chatKey,
              isRead,
              readBy: [],
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
         } catch (error) {
            console.error("Error while saving message:", error);
         }
    }

    async updateStatusMessage(fromId: string,toId: string,isRead: boolean){
        const chatKey = [fromId,toId].sort().join('_')

        const snapshot = await this.db
        .collection('messages')
        .where('chatKey','==',chatKey)
        .where('isRead','==',false)
        .get()

        const batch = this.db.batch()

        snapshot.forEach((doc) => {
            const messageData = doc.data()
            const readBy = messageData.readBy || []
            if(!readBy.includes(fromId)){
                readBy.push(fromId)
            }
            if(readBy.length === 2){
                isRead = true
            }
            batch.update(doc.ref,{
                isRead: isRead,
                readBy: readBy
                
            })
        })

        await batch.commit()

    }


    async getMessages(fromUserId: string, toUserId: string){

        const chatKey = [fromUserId,toUserId].sort().join('_')

        const snapshot = await this.db
        .collection('messages')
        .where('chatKey' , '==', chatKey)
        .orderBy('timestamp','asc')
        .get()

        const messages = snapshot.docs.map(doc => doc.data())
        
        return messages
      


    }


    async updateUserStatus(userId: string, status: 'online' | 'offline'){
        const userRef = this.db.collection('user').doc(userId);
        const doc = await userRef.get();
        if(doc.exists){
            await userRef.update({
                status: status,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            })
        }else{
            await userRef.set({
                status,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            })
        }

       
    }
}