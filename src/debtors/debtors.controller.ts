import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { DebtorsService } from './debtors.service';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';

@Controller('debtors')
@UseGuards(JwtAuthGuard)
export class DebtorsController {
  constructor(private readonly debtorsService: DebtorsService) {}

  @Post()
  create(@Body() createDebtorDto: CreateDebtorDto, @CurrentUser() user: User) {
    return this.debtorsService.create(createDebtorDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.debtorsService.findAll(user.id);
  }

  @Get('summary')
  getSummary(@CurrentUser() user: User) {
    return this.debtorsService.getSummary(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.debtorsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDebtorDto: UpdateDebtorDto,
    @CurrentUser() user: User,
  ) {
    return this.debtorsService.update(id, updateDebtorDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.debtorsService.remove(id, user.id);
  }
}
