import { Module, Global } from '@nestjs/common';
import { StockUpdateGateway } from './stock-update.gateway';

@Global() // Make accessible everywhere without repetitive imports
@Module({
    providers: [StockUpdateGateway],
    exports: [StockUpdateGateway],
})
export class SocketModule { }
