<template>
  <div>
    <span
      v-if="
        error.statusCode === 404 ||
          parseInt(error.response && error.response.status, 10) === 404
      "
    >
      ページが見つかりません
    </span>
    <span
      v-else-if="
        error.statusCode === 403 ||
          parseInt(error.response && error.response.status, 10) === 403
      "
    >
      許可されていない操作です
    </span>
    <span
      v-else-if="parseInt(error.response && error.response.status, 10) === 401"
    >
      再度ログインしてください
    </span>
    <span v-else>
      エラーが発生しました
    </span>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component({
  props: ["error"]
})
export default class Error extends Vue {}
</script>
