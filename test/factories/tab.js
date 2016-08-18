import faker from 'faker';

export default function createTab({
  windowId   = faker.random.number(),
  index      = faker.random.number(),
  title      = faker.name.title(),
  url        = faker.internet.url(),
  favIconUrl = faker.image.imageUrl()
} = {}) {
  return {
    windowId,
    index,
    title,
    url,
    favIconUrl
  };
}
