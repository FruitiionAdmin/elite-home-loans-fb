export default function checkFileSize(input,maxSize) {
    const maxSizeInBytes = maxSize * 1024 * 1024
    const size = input.size

    if (size > maxSizeInBytes) return false

    return true

}