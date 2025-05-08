import { Controller, Get, Head } from "@nestjs/common";


@Controller()
export class HealthController{
    @Get('/health')
    @Head('/health') 
    healthCheck() {
      return { status: 'ok' };
    }
}