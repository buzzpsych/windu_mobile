import { GET_RECENT_ACTIVITY } from "../graphql/queries/activity/getRecentActivity";
import _ from "lodash";

export function updateRecentActivities(cache, activity) {
  const data = cache.readQuery({
    query: GET_RECENT_ACTIVITY,
  });

  if (data) {
    const { getRecentActivity } = data;
    const copy = _.cloneDeep(getRecentActivity);

    cache.writeQuery({
      query: GET_RECENT_ACTIVITY,
      data: {
        getRecentActivity: {
          day: [activity, ...copy.day],
          month: [activity, ...copy.month],
          week: [activity, ...copy.week],
        },
      },
    });
  }
}
