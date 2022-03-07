export function debounce<T extends unknown[], U>(callback: (...args: T) => PromiseLike<U> | U, wait: number) {
  let timer: ReturnType<typeof setTimeout>

  return (...args: T): Promise<U> => {
    clearTimeout(timer)
    return new Promise(resolve => {
      timer = setTimeout(() => resolve(callback(...args)), wait)
    })
  }
}
