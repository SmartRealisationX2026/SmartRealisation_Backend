import { Module } from '@nestjs/common';
import { AddressService } from './address/address.service';

@Module({
  providers: [AddressService]
})
export class AddressModule {}
