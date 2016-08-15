export default function createWindow({
  id = 0,
  left = 0,
  top = 0,
  width = 0,
  height = 0,
  focused = false
} = {}) {
  return {
    id,
    left,
    top,
    width,
    height,
    focused
  };
}
