// See https://axios.nuxtjs.org/helpers
export default ({ $axios, store, redirect }): void => {
  $axios.onRequest(config => {
    let { token } = store.state;
    if (process.env.Token !== "") {
      token = process.env.Token;
    }

    if (token && config.url.startsWith("/")) {
      config.headers.common.Authorization = `Bearer ${token}`;
    }
  });

  $axios.onError(error => {
    console.error(error); // eslint-disable-line no-console
    const code = parseInt(error.response && error.response.status, 10);
    if (code === 401) {
      redirect("/signin");
    }
  });
};
