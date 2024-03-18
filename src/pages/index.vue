<script setup lang="ts">
import type { UploadUserFile } from 'element-plus'
import Compressor from 'compressorjs'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

definePage({
  meta: {
    layout: 'home',
  },
})

const fileList = ref<UploadUserFile[]>([])

async function compress() {
  if (fileList.value.length === 0) {
    return
  }

  if (fileList.value.length === 1) {
    const file = fileList.value[0]
    const result = await new Promise<Blob>((resolve, reject) => {
      new Compressor(file.raw!, {
        quality: 0.6,
        success(result) {
          resolve(result)
        },
        error(err) {
          reject(err.message)
        },
      })
    })
    saveAs(result, file.name)
    return
  }

  try {
    const zip = new JSZip()
    const compressions = fileList.value.map((file) => compressFile(file, zip))
    await Promise.all(compressions)
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'compressed.zip')
  } catch (error) {
    console.error('Compression error:', error)
  }
}

async function compressFile(file: UploadUserFile, zip: JSZip) {
  return new Promise<void>((resolve, reject) => {
    new Compressor(file.raw!, {
      quality: 0.6,
      success(result) {
        zip.file(file.name, result)
        resolve()
      },
      error(err) {
        reject(err.message)
      },
    })
  })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p>🛠️ Compressor</p>

    <el-upload
      v-model:file-list="fileList"
      drag
      multiple
      :auto-upload="false"
      list-type="picture"
    >
      <div class="el-icon--upload i-carbon-cloud-upload"></div>

      <div class="el-upload__text">将文件拖放到此处或<em>单击上传</em></div>
    </el-upload>

    <div>
      <el-button type="primary" @click="compress">
        <template #icon>
          <div class="i-carbon-download" />
        </template>
        下载
      </el-button>
    </div>
  </div>
</template>
