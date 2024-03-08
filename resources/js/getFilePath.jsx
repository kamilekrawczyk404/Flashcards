export const getFilePath = (pathFromPublic) =>
  `${window.location.origin}/storage${pathFromPublic}`;