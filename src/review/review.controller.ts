import { UseGuards } from '@nestjs/common'
import { UsePipes, ValidationPipe } from '@nestjs/common'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common'
import { IdValidationPipe } from 'src/pipes/id-validation.pipe'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { UserEmail } from '../decorators/user-email.decorator'
import { CreateReviewDto } from './dto/create-review.dto'
import { REVIEW_NOT_FOUND } from './review.constants'
import { ReviewService } from './review.service'

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Get('byProduct/:productId')
  async getByProduct(
    @Param('productId', IdValidationPipe) productId: string,
    @UserEmail() email: string
  ) {
    return this.reviewService.findByProductId(productId)
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.reviewService.delete(id)
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
  }
}
