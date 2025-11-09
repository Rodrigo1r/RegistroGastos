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
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Expense Types')
@Controller('expense-types')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpenseTypesController {
  constructor(private readonly expenseTypesService: ExpenseTypesService) {}

  // Endpoints para Tipos de Gastos
  @Post()
  @ApiOperation({ summary: 'Crear nuevo tipo de gasto' })
  createType(@Body() createExpenseTypeDto: CreateExpenseTypeDto, @CurrentUser() user: User) {
    return this.expenseTypesService.createType(createExpenseTypeDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de gastos' })
  findAllTypes(@CurrentUser() user: User) {
    return this.expenseTypesService.findAllTypes(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de gasto por ID' })
  findOneType(@Param('id') id: string, @CurrentUser() user: User) {
    return this.expenseTypesService.findOneType(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tipo de gasto' })
  updateType(
    @Param('id') id: string,
    @Body() updateExpenseTypeDto: UpdateExpenseTypeDto,
    @CurrentUser() user: User,
  ) {
    return this.expenseTypesService.updateType(id, updateExpenseTypeDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tipo de gasto' })
  removeType(@Param('id') id: string, @CurrentUser() user: User) {
    return this.expenseTypesService.removeType(id, user.id);
  }

  // Endpoints para Detalles de Gastos
  @Post('details')
  @ApiOperation({ summary: 'Crear nuevo detalle de gasto' })
  createDetail(@Body() createExpenseDetailDto: CreateExpenseDetailDto, @CurrentUser() user: User) {
    return this.expenseTypesService.createDetail(createExpenseDetailDto, user.id);
  }

  @Get('details/all')
  @ApiOperation({ summary: 'Obtener todos los detalles de gastos' })
  findAllDetails(@CurrentUser() user: User) {
    return this.expenseTypesService.findAllDetails(user.id);
  }

  @Get(':typeId/details')
  @ApiOperation({ summary: 'Obtener detalles de gastos por tipo' })
  findDetailsByType(@Param('typeId') typeId: string, @CurrentUser() user: User) {
    return this.expenseTypesService.findDetailsByType(typeId, user.id);
  }

  @Get('details/:id')
  @ApiOperation({ summary: 'Obtener un detalle de gasto por ID' })
  findOneDetail(@Param('id') id: string, @CurrentUser() user: User) {
    return this.expenseTypesService.findOneDetail(id, user.id);
  }

  @Patch('details/:id')
  @ApiOperation({ summary: 'Actualizar detalle de gasto' })
  updateDetail(
    @Param('id') id: string,
    @Body() updateExpenseDetailDto: UpdateExpenseDetailDto,
    @CurrentUser() user: User,
  ) {
    return this.expenseTypesService.updateDetail(id, updateExpenseDetailDto, user.id);
  }

  @Delete('details/:id')
  @ApiOperation({ summary: 'Eliminar detalle de gasto' })
  removeDetail(@Param('id') id: string, @CurrentUser() user: User) {
    return this.expenseTypesService.removeDetail(id, user.id);
  }
}
