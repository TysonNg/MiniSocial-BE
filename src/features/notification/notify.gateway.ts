import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserData, WsAuthGuard } from 'src/guards/ws-auth.guards';
import { NotifyService } from './notify.service';
import { NotifiEntity } from './entities/notify.entity';

@WebSocketGateway({
  namespace: '/notify',
  transports: ['websocket'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class NotifyGateWay {
  private userSocketMap = new Map<string, Socket>();

  @WebSocketServer() server: Server;

  constructor(private readonly notifyService: NotifyService) {}

  async handleConnection(client: Socket) {
    const { userId } = client.handshake?.auth;

    this.userSocketMap.set(userId, client);
  }

  async handleDisconnect(client: Socket) {
    const { userId } = client.handshake?.auth;

    if (userId) {
      this.userSocketMap.delete(userId);
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('newLike')
  async handleNewLike(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { toUser: string; postId: string },
  ) {
    const fromUser: UserData = client.data.user;
    const { toUser, postId } = payload;
    const notification: NotifiEntity =
      await this.notifyService.createNotification(
        fromUser.id,
        toUser,
        postId,
        'like',
      );

    const targetSocket = this.userSocketMap.get(toUser);

    if (targetSocket) {
      targetSocket.emit('notification', {
        type: 'like',
        fromUser: notification.fromUserId,
        fromUrl: fromUser.url,
        fromName: fromUser.userName,
        postId,
        createdAt: notification.createdAt,
      });
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('newCommentToPost')
  async handleNewComment(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { toUser: string; postId: string },
  ) {
    const fromUser: UserData = client.data.user;
    const { toUser, postId } = payload;
    const notification: NotifiEntity =
      await this.notifyService.createNotification(
        fromUser.id,
        toUser,
        postId,
        'commentPost',
      );
      
    const targetSocket = this.userSocketMap.get(toUser);

    if (targetSocket) {
      targetSocket.emit('notification', {
        type: 'commentPost',
        fromUser: notification.fromUserId,
        fromUrl: fromUser.url,
        fromName: fromUser.userName,
        postId,
        createdAt: notification.createdAt,
      });
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('newReplyComment')
  async handleNewReplyComment(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { toUser: string; postId: string },
  ) {
    const fromUser: UserData = client.data.user;
    const { toUser, postId } = payload;
    const notification: NotifiEntity =
      await this.notifyService.createNotification(
        fromUser.id,
        toUser,
        postId,
        'commentReply',
      );
      
    const targetSocket = this.userSocketMap.get(toUser);

    if (targetSocket) {
      targetSocket.emit('notification', {
        type: 'commentReply',
        fromUser: notification.fromUserId,
        fromUrl: fromUser.url,
        fromName: fromUser.userName,
        postId,
        createdAt: notification.createdAt,
      });
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('newFollow')
  async handleNewFollow(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { toUser: string; postId: string },
  ) {
    const fromUser: UserData = client.data.user;
    const { toUser, postId } = payload;
    const notification: NotifiEntity =
      await this.notifyService.createNotification(
        fromUser.id,
        toUser,
        postId,
        'follow',
      );
      
    const targetSocket = this.userSocketMap.get(toUser);

    if (targetSocket) {
      targetSocket.emit('notification', {
        type: 'commentReply',
        fromUser: notification.fromUserId,
        fromUrl: fromUser.url,
        fromName: fromUser.userName,
        postId,
        createdAt: notification.createdAt,
      });
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('getNotificationsNotYetRead')
  async handleGetNotifications(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string },
  ) {
    const { userId } = payload;
    const allNotifications: NotifiEntity[] =
      await this.notifyService.getAllNotification(userId, false);

    client.emit('getNotificaionsNotYetRead', { allNotifications });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('getAllNotifications')
  async handleGetAllNotifications(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string },
  ) {
    const { userId } = payload;
    const allNotificationNotYetRead: NotifiEntity[] =
      await this.notifyService.getAllNotification(userId, false);
      
      await Promise.all(
        allNotificationNotYetRead.map(noti => {
          return this.notifyService.markAsRead(noti.notifyId)
        })
      )
   
    
    const allNotifications = await this.notifyService.getAllNotification(userId,true)
    if (!allNotifications || allNotifications.length === 0) {
      console.log('No notifications found');
    }

    client.emit('getAllNotifications',{
      allNotifications
    })
  }
}
