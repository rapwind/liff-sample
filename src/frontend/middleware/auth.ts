export default function({ store }): void {
  if (!store.state.token) {
    store.$router.push("/signin");
  }
}
