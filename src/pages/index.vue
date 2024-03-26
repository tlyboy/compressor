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

const compressor = useCompressorStore()

const fileList = ref<UploadUserFile[]>([])

async function compress() {
  if (fileList.value.length === 0) {
    return
  }

  if (fileList.value.length === 1) {
    const file = fileList.value[0]
    const result = await new Promise<Blob>((resolve, reject) => {
      new Compressor(file.raw!, {
        ...compressor.options,
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
      ...compressor.options,
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
  <div class="flex h-full flex-col gap-4">
    <p class="text-center">🛠️ 图像压缩器</p>

    <el-form
      :inline="true"
      :model="compressor.options"
      class="demo-form-inline"
      label-width="auto"
    >
      <el-form-item label="质量">
        <el-input-number
          v-model="compressor.options.quality"
          :min="0.1"
          :max="1"
          :step="0.1"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="最大宽度">
        <el-input-number
          v-model="compressor.options.maxWidth"
          :min="0"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="最大高度">
        <el-input-number
          v-model="compressor.options.maxHeight"
          :min="0"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="最小宽度">
        <el-input-number
          v-model="compressor.options.minWidth"
          :min="0"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="最小高度">
        <el-input-number
          v-model="compressor.options.minHeight"
          :min="0"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="宽度">
        <el-input-number
          v-model="compressor.options.width"
          :min="0"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="高度">
        <el-input-number
          v-model="compressor.options.height"
          :min="0"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="调整大小">
        <el-select
          v-model="compressor.options.resize"
          placeholder="请选择"
          style="width: 200px"
        >
          <el-option label="none" value="none" />
          <el-option label="contain" value="contain" />
          <el-option label="cover" value="cover" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="compressor.reset">
          <template #icon>
            <div class="i-carbon-reset" />
          </template>
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <div>
      <el-upload
        v-model:file-list="fileList"
        drag
        multiple
        :auto-upload="false"
        list-type="picture"
        accept="image/*"
      >
        <div class="el-icon--upload i-carbon-cloud-upload"></div>

        <div class="el-upload__text">将图片拖放到此处或<em>单击选择</em></div>
      </el-upload>
    </div>

    <div class="text-center">
      <el-button type="primary" @click="compress">
        <template #icon>
          <div
            class="i-carbon-ibm-openshift-container-platform-on-vpc-for-regulated-industries"
          />
        </template>
        压缩
      </el-button>
      <el-button @click="fileList.splice(0)">
        <template #icon>
          <div class="i-carbon-reset" />
        </template>
        重置
      </el-button>
    </div>
  </div>
</template>
