import Compressor from 'compressorjs'

export const useCompressorStore = defineStore(
  'compressor',
  () => {
    const options = ref<Compressor.Options>({
      quality: 0.6,
      maxWidth: undefined,
      maxHeight: undefined,
      minWidth: 0,
      minHeight: 0,
      width: undefined,
      height: undefined,
      resize: 'none',
    })

    function reset() {
      options.value = {
        quality: 0.6,
        maxWidth: undefined,
        maxHeight: undefined,
        minWidth: 0,
        minHeight: 0,
        width: undefined,
        height: undefined,
        resize: 'none',
      }
    }

    return {
      options,
      reset,
    }
  },
  {
    persist: true,
  },
)
