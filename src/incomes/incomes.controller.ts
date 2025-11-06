import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Ingresos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo ingreso' })
  @ApiResponse({ status: 201, description: 'Ingreso registrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Tipo de ingreso no encontrado' })
  create(@Body() createIncomeDto: CreateIncomeDto, @CurrentUser() user: User) {
    return this.incomesService.create(createIncomeDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los ingresos del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de ingresos obtenida' })
  findAll(@CurrentUser() user: User) {
    return this.incomesService.findAll(user.id);
  }

  @Get('summary/monthly')
  @ApiOperation({ summary: 'Obtener resumen mensual de ingresos' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'month', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Resumen mensual obtenido' })
  getMonthlySummary(
    @CurrentUser() user: User,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.incomesService.getMonthlySummary(user.id, year, month);
  }

  @Get('summary/yearly')
  @ApiOperation({ summary: 'Obtener resumen anual de ingresos' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Resumen anual obtenido' })
  getYearlySummary(
    @CurrentUser() user: User,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return this.incomesService.getYearlySummary(user.id, year);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ingreso por ID' })
  @ApiResponse({ status: 200, description: 'Ingreso encontrado' })
  @ApiResponse({ status: 404, description: 'Ingreso no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.incomesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un ingreso' })
  @ApiResponse({ status: 200, description: 'Ingreso actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Ingreso no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
    @CurrentUser() user: User,
  ) {
    return this.incomesService.update(id, updateIncomeDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un ingreso' })
  @ApiResponse({ status: 200, description: 'Ingreso eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Ingreso no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.incomesService.remove(id, user.id);
  }
}
