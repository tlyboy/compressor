<script setup lang="ts">
import Compressor from 'compressorjs'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { UploadUserFile } from 'element-plus'

definePage({
  meta: {
    layout: 'home',
  },
})

const fileList = ref<UploadUserFile[]>([])

async function compress() {
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

    <ElUpload v-model:file-list="fileList" drag multiple :auto-upload="false">
      <div class="el-icon--upload i-carbon-cloud-upload"></div>

      <div class="el-upload__text">将文件拖放到此处或<em>单击上传</em></div>
    </ElUpload>

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
