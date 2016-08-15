export default function createWindow({
  left = 0,
  top = 0,
  width = 0,
  height = 0
} = {}) {
  return {
    left,
    top,
    width,
    height
  };
}
