export default async (context): Promise<void> => {
  await context.store.dispatch("nuxtClientInit", context);
};
