import { GET_RECENT_ACTIVITY } from "../graphql/queries/activity/getRecentActivity";
import { GET_PAUSED_ACTIVITY } from "../graphql/queries/activity/getPausedActivity";
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

export function updateContinueActivityList(cache, activity, operation) {
  const data = cache.readQuery({
    query: GET_PAUSED_ACTIVITY,
  });

  if (data) {
    const { getPausedActivity } = data;
    const copy = _.cloneDeep(getPausedActivity);

    let newArray = [];

    if (operation === "continue")
      newArray = _.filter(copy, (value) => value._id !== activity._id);

    if (operation === "paused") newArray = [activity, ...copy];

    cache.writeQuery({
      query: GET_PAUSED_ACTIVITY,
      data: {
        getPausedActivity: newArray,
      },
    });
  }
}
