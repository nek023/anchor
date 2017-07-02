export default function createDisplay({
  bounds = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  },
  isPrimary = false
} = {}) {
  return {
    bounds,
    isPrimary
  };
}
