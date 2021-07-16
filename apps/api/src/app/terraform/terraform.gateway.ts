import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Client, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'terraform', cors: true })
export class TerraformGateway implements OnGatewayInit {
  private readonly nestLogger = new Logger(TerraformGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    // timer(5000, 5000).subscribe(()=>{
    //   server.emit('plan-output', {data: 'Plan done!'});
    // });
  }

  @SubscribeMessage('message')
  handleMessage(client: Client, payload: any): string {
    return 'Hello world!';
  }

  emit(event: string, data: any) {
    this.server.emit(event, data);
  }
}
