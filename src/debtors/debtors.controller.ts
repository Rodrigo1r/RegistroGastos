import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DebtorsService } from './debtors.service';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';

@Controller('debtors')
@UseGuards(JwtAuthGuard)
export class DebtorsController {
  constructor(private readonly debtorsService: DebtorsService) {}

  @Post()
  create(@Body() createDebtorDto: CreateDebtorDto, @Request() req) {
    return this.debtorsService.create(createDebtorDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.debtorsService.findAll(req.user.sub);
  }

  @Get('summary')
  getSummary(@Request() req) {
    return this.debtorsService.getSummary(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.debtorsService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDebtorDto: UpdateDebtorDto,
    @Request() req,
  ) {
    return this.debtorsService.update(id, updateDebtorDto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.debtorsService.remove(id, req.user.sub);
  }
}
