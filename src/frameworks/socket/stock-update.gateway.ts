import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*', // Allow all for MVP
    },
    namespace: 'stock', // /stock namespace
})
export class StockUpdateGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        // console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        // console.log(`Client disconnected: ${client.id}`);
    }

    // Method to broadcast stock updates
    broadcastStockUpdate(pharmacyId: string, medicationId: string, newQuantity: number) {
        this.server.emit('stock_update', {
            pharmacyId,
            medicationId,
            newQuantity,
            timestamp: new Date(),
        });
    }

    // Optional: Allow clients to join specific pharmacy rooms if we want targeted updates later
    @SubscribeMessage('join_pharmacy')
    handleJoinPharmacy(client: Socket, pharmacyId: string) {
        client.join(`pharmacy_${pharmacyId}`);
        return `Joined pharmacy_${pharmacyId}`;
    }
}
