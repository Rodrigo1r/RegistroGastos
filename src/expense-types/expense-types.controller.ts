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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExpenseTypesService } from './expense-types.service';
import { CreateExpenseTypeDto } from './dto/create-expense-type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense-type.dto';
import { CreateExpenseDetailDto } from './dto/create-expense-detail.dto';
import { UpdateExpenseDetailDto } from './dto/update-expense-detail.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Expense Types')
@Controller('expense-types')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpenseTypesController {
  constructor(private readonly expenseTypesService: ExpenseTypesService) {}

  // Endpoints para Tipos de Gastos
  @Post()
  @ApiOperation({ summary: 'Crear nuevo tipo de gasto' })
  createType(@Body() createExpenseTypeDto: CreateExpenseTypeDto) {
    return this.expenseTypesService.createType(createExpenseTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de gastos' })
  findAllTypes() {
    return this.expenseTypesService.findAllTypes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de gasto por ID' })
  findOneType(@Param('id') id: string) {
    return this.expenseTypesService.findOneType(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tipo de gasto' })
  updateType(
    @Param('id') id: string,
    @Body() updateExpenseTypeDto: UpdateExpenseTypeDto,
  ) {
    return this.expenseTypesService.updateType(id, updateExpenseTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tipo de gasto' })
  removeType(@Param('id') id: string) {
    return this.expenseTypesService.removeType(id);
  }

  // Endpoints para Detalles de Gastos
  @Post('details')
  @ApiOperation({ summary: 'Crear nuevo detalle de gasto' })
  createDetail(@Body() createExpenseDetailDto: CreateExpenseDetailDto) {
    return this.expenseTypesService.createDetail(createExpenseDetailDto);
  }

  @Get('details/all')
  @ApiOperation({ summary: 'Obtener todos los detalles de gastos' })
  findAllDetails() {
    return this.expenseTypesService.findAllDetails();
  }

  @Get(':typeId/details')
  @ApiOperation({ summary: 'Obtener detalles de gastos por tipo' })
  findDetailsByType(@Param('typeId') typeId: string) {
    return this.expenseTypesService.findDetailsByType(typeId);
  }

  @Get('details/:id')
  @ApiOperation({ summary: 'Obtener un detalle de gasto por ID' })
  findOneDetail(@Param('id') id: string) {
    return this.expenseTypesService.findOneDetail(id);
  }

  @Patch('details/:id')
  @ApiOperation({ summary: 'Actualizar detalle de gasto' })
  updateDetail(
    @Param('id') id: string,
    @Body() updateExpenseDetailDto: UpdateExpenseDetailDto,
  ) {
    return this.expenseTypesService.updateDetail(id, updateExpenseDetailDto);
  }

  @Delete('details/:id')
  @ApiOperation({ summary: 'Eliminar detalle de gasto' })
  removeDetail(@Param('id') id: string) {
    return this.expenseTypesService.removeDetail(id);
  }
}
