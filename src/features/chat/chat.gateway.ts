import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FireBaseService } from 'src/firebase/firebase.service';
import { UserData, WsAuthGuard } from 'src/guards/ws-auth.guards';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateWay {
  private userSocketMap = new Map<string, Socket>()

  constructor(
    private readonly firebaseService: FireBaseService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {

    const { userId } = client.handshake?.auth;

    
    this.userSocketMap.set(userId, client);
    
    await this.firebaseService.updateUserStatus(userId,'online')
  }


  async handleDisconnect(client: Socket) {
    const { userId } = client.handshake?.auth;

    await this.firebaseService.updateUserStatus(userId,'offline')

  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('privateMessage')
  async handleNewMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { toUserId: string; message: string },
  ) {
    const fromUser:UserData = client.data.user;
    if (!fromUser) return;

    const { toUserId, message } = payload;
    
    // save message into firebase store
    if(fromUser.id && toUserId && message){
      await this.firebaseService.saveMessage(fromUser.id,fromUser.url,fromUser.userName,toUserId,message, false,[])
    }

    console.log(
      `📩 Received message from ${fromUser.userName} to ${toUserId} with messages ${message}`,
    );

    const socket = this.userSocketMap.get(toUserId);

    if (socket) {
      
      socket.emit('privateMessage', {
        user:{
          userName: fromUser.userName,
          imgUrl: fromUser.url,
          fromId: fromUser.id,
          toId: toUserId
        }, message 
      });

      
    } else {
      console.log(`User ${toUserId} not connected`);
    }
    
    client.emit('privateMessageSent', { user:{
      userName: fromUser.userName,
      imgUrl: fromUser.url
    }, message });
   
    this.server.emit('reply', 'loadinggg.....');
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('getHistoryPrivateMessages')
  async handleGetMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() toUserId: string
  ) {
    console.log(toUserId);
    
    const fromUser: UserData = client.data.user
    const historyMessages = await this.firebaseService.getMessages(fromUser.id,toUserId)

    client.emit('historyMessagesSent',{historyMessages})
  }

  
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('markMessagesAsRead')
  async handleMarkMessagesAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: {toId: string}
  ) {
    const{toId} = payload
    
    const fromUser: UserData = client.data.user
    console.log('vao r',fromUser);

    await this.firebaseService.updateStatusMessage(fromUser.id,toId,false)
  }
}
