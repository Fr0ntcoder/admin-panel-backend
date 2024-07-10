import {
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { IFile } from 'src/media/media.interface'
import { FileValidationPipe } from 'src/media/pipes/file.validation.pipe'
import { FolderValidationPipe } from 'src/media/pipes/folder.validation.pipe'
import { MediaService } from './media.service'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @HttpCode(200)
  @Post()
  @UseInterceptors(FilesInterceptor('media'))
  @UsePipes(new FolderValidationPipe())
  async uploadMediaFile(
    @UploadedFiles(FileValidationPipe) mediaFiles: IFile | IFile[],
    @Query('folder') folder?: string,
  ) {
    return this.mediaService.saveMedia(mediaFiles, folder)
  }
}
