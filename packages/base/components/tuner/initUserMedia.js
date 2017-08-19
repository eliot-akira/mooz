
let getUserMedia

export default function initUserMedia() {

  if (getUserMedia) return getUserMedia

  // navigator.mediaDevices shim
  // @see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {}
  }

  // Some browsers partially implement mediaDevices
  // Add getUserMedia property if it's missing
  if (navigator.mediaDevices.getUserMedia === undefined) {

    navigator.mediaDevices.getUserMedia = function(constraints) {
      let legacyGetUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
      if (!legacyGetUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
      }

      // Wrap the call with a Promise
      return new Promise(function(resolve, reject) {
        legacyGetUserMedia.call(navigator, constraints, resolve, reject)
      })
    }
  }

  getUserMedia = async (...args) => await navigator.mediaDevices.getUserMedia(...args)

  return getUserMedia
}
