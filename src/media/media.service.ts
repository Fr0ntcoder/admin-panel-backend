import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import { IFile, IMediaResponse } from 'src/media/media.interface'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class MediaService {
  async saveMedia(
    mediaFiles: IFile | IFile[],
    folder = 'default',
  ): Promise<IMediaResponse[]> {
    const folderLowerCase = folder.toLowerCase()
    const uploadFolder = `${path}/uploads/${folderLowerCase}`
    await ensureDir(uploadFolder)

    const responses: IMediaResponse[] = []

    for (const file of Array.isArray(mediaFiles) ? mediaFiles : [mediaFiles]) {
      const fileName = file?.originalname || file?.name

      const uniqueSuffix = uuidv4().split('-')[0]
      const uniqueFileName = `${uniqueSuffix}-${fileName}`

      await writeFile(`${uploadFolder}/${uniqueFileName}`, file.buffer)

      responses.push({
        url: `/uploads/${folderLowerCase}/${uniqueFileName}`,
        name: uniqueFileName,
      })
    }

    return responses
  }
}
