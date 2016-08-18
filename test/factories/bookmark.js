import faker from 'faker';

export default function createBookmark({
  title = faker.name.title(),
  url   = faker.internet.url()
} = {}) {
  return {
    title,
    url
  };
}
