export const todoPatterns = {
  reset: /(초기화|리셋|새로\s작성|다\s지워|전부\s삭제|다\s삭제)/,
  create: /투두리스트(?:를|를\s)?\s*작성하고\s싶어/,
  add: /투두\s리스트(?:에|에\s)?\s*(추가|넣어)/,
  update: /(수정|변경|바꾸고|바꿔)/,
  delete: /(삭제|제거|빼|빼고|지우|지워)/,
  recommend: /(추천|제안)/
};

export const isTodoReset = (message: string): boolean => todoPatterns.reset.test(message);
export const isTodoCreate = (message: string): boolean => todoPatterns.create.test(message);
export const isTodoAdd = (message: string): boolean => todoPatterns.add.test(message);
export const isTodoUpdate = (message: string): boolean => todoPatterns.update.test(message);
export const isTodoDelete = (message: string): boolean => todoPatterns.delete.test(message);
export const isTodoRecommend = (message: string): boolean => todoPatterns.recommend.test(message);
