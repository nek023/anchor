import faker from 'faker';

export default function createHistory({
  title = faker.name.title(),
  url   = faker.internet.url()
} = {}) {
  return {
    title,
    url
  };
}
