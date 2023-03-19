// import {
//     SubscribeMessage,
//     WebSocketGateway,
//     WebSocketServer,
//     OnGatewayDisconnect, ConnectedSocket, MessageBody, OnGatewayConnection,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
//
//
// interface User {
//     id: string;
//     email: string;
//     fullName?: string;
//     imageUrl?: string;
//     socketId: string;
// }
//
// interface Message {
//     id: number;
//     sender: User;
//     text: string;
//     createdAt: number;
// }
//
// @WebSocketGateway({ cors: {
//         origin: '*',
//     } })
// export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection {
//     @WebSocketServer() server: Server;
//
//     private readonly users = []
//
//     handleDisconnect(@ConnectedSocket() client: Socket) {
//         this.users.forEach((user) => {
//             if (user.socketId === client.id) {
//                 this.users.filter(curr => curr.id !== user.id);
//                 console.log(`User ${user.id} disconnected`);
//                 this.server.emit('getUsers', this.users);
//             }
//         });
//     }
//
//     handleConnection(client: any, ...args: any[]): any {
//
//         // listen to "join" event from client
//         client.on("join", (user: User) => {
//             console.log(`User ${user.id} joined with socket ID ${client.id}`);
//             // save user's socket ID to users Map object
//             this.users.push( { ...user, socketId: client.id });
//
//             console.log(this.users)
//         });
//     }
//
//     @SubscribeMessage('addUser')
//     handleAddUser(@ConnectedSocket() client: Socket, @MessageBody() user: User) {
//         console.log(user)
//         if (!this.users.some(curr => curr.id === user.id)) {
//             const newUser = { ...user, socketId: client.id };
//             this.users.push(newUser);
//         }
//         this.server.emit('getUsers', this.users);
//     }
//
//     @SubscribeMessage('sendMessage')
//     async handleSendMessage(
//         @ConnectedSocket() client: Socket,
//         @MessageBody() data: { sender: User; receivers: string; text: string, id: number },
//     ) {
//         const { sender, receivers, text, id } = data;
//         const receiverIds = receivers.split(',');
//
//         const users = receiverIds
//             .map((id) => this.users.find(user => user.id === id))
//             .filter((user) => user && user.id !== sender.id);
//
//         console.log(this.users)
//         if (users.length === 0) {
//             throw new Error(`No users found with ids: ${receiverIds.join(', ')}`);
//         }
//
//         const message: Message = {
//             id,
//             sender,
//             text,
//             createdAt: Date.now(),
//         };
//
//         const promises = users.map((user) =>
//             this.server.to(user.socketId).emit('getMessage', message),
//         );
//
//         await Promise.all(promises);
//     }
// }