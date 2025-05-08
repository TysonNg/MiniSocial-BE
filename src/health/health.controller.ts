import { Controller, Get, Head, Param, Post, Put, Req, UseGuards } from "@nestjs/common";


@Controller()
export class HealthController{
    @Get('/health')
    @Head('/health') 
    healthCheck() {
      return { status: 'ok' };
    }
}