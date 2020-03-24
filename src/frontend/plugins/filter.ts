import { Vue } from "vue-property-decorator";
import * as moment from "moment";

Vue.filter("moment", (date: string | number) =>
  moment(date).format("YYYY/MM/DD HH:mm")
);

Vue.filter("momentSSS", (date: string | number) =>
  moment(date).format("YYYY/MM/DD HH:mm:SSS")
);

Vue.filter("momentHm", (date: string | number) => moment(date).format("HH:mm"));

Vue.filter("momentYMD", (date: string | number) => {
  if (moment(date).year() !== moment().year()) {
    return moment(date).format("YYYY/MM/DD");
  }
  return moment(date).format("MM/DD");
});

Vue.filter("momentFromNow", (date: string | number) => moment(date).fromNow());
