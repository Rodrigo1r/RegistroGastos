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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IncomeTypesService } from './income-types.service';
import { CreateIncomeTypeDto } from './dto/create-income-type.dto';
import { UpdateIncomeTypeDto } from './dto/update-income-type.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tipos de Ingreso')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('income-types')
export class IncomeTypesController {
  constructor(private readonly incomeTypesService: IncomeTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de ingreso' })
  @ApiResponse({
    status: 201,
    description: 'Tipo de ingreso creado exitosamente',
  })
  @ApiResponse({ status: 409, description: 'El tipo de ingreso ya existe' })
  create(@Body() createIncomeTypeDto: CreateIncomeTypeDto) {
    return this.incomeTypesService.create(createIncomeTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de ingreso' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de ingreso obtenida',
  })
  findAll() {
    return this.incomeTypesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener tipos de ingreso activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de ingreso activos',
  })
  findActive() {
    return this.incomeTypesService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de ingreso por ID' })
  @ApiResponse({ status: 200, description: 'Tipo de ingreso encontrado' })
  @ApiResponse({ status: 404, description: 'Tipo de ingreso no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.incomeTypesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de ingreso' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de ingreso actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Tipo de ingreso no encontrado' })
  @ApiResponse({ status: 409, description: 'El nombre ya existe' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIncomeTypeDto: UpdateIncomeTypeDto,
  ) {
    return this.incomeTypesService.update(id, updateIncomeTypeDto);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Activar/desactivar un tipo de ingreso' })
  @ApiResponse({
    status: 200,
    description: 'Estado del tipo de ingreso cambiado',
  })
  @ApiResponse({ status: 404, description: 'Tipo de ingreso no encontrado' })
  toggleActive(@Param('id', ParseUUIDPipe) id: string) {
    return this.incomeTypesService.toggleActive(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tipo de ingreso' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de ingreso eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Tipo de ingreso no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.incomeTypesService.remove(id);
  }
}
