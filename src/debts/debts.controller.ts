import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';

@Controller('debts')
@UseGuards(JwtAuthGuard)
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  create(@Body() createDebtDto: CreateDebtDto, @CurrentUser() user: User) {
    return this.debtsService.create(createDebtDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User, @Query('debtorId') debtorId?: string) {
    if (debtorId) {
      return this.debtsService.findByDebtor(debtorId, user.id);
    }
    return this.debtsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.debtsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDebtDto: UpdateDebtDto,
    @CurrentUser() user: User,
  ) {
    return this.debtsService.update(id, updateDebtDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.debtsService.remove(id, user.id);
  }
}
